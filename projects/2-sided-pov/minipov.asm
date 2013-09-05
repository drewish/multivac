	title "MiniPOV"
	LIST	P=16F630, F=INHX8M
#include <p16f630.inc>
	__CONFIG  _INTRC_OSC_NOCLKOUT & _CP_OFF & _MCLRE_OFF & _WDT_OFF 
XTAL		EQU	4000000       ; internal crystal @ 4MHz

;
; a two sided POV toy. 
;
; the idea is that you attach this to a bike wheel and as it spins it spells 
; out something the problem is that each side needs to read the string from 
; a different end. this project uses separate string tables for front and back.
; one side reads forward, the other reads backwards.

; uncomment the following line to slow the timer and display a test pattern.
;#define TESTING 0

; backup spots for registers during interrupt handling
w_bak		equ	0x20
status_bak	equ	0x21
fsr_bak 	equ	0x22

charF		equ	0x23	; current character reading forwards
rowF 		equ	0x24	; current row reading forwards
buffF		equ	0x25	; last forward row 
charB		equ	0x27	; current character reading backwards
rowB 		equ	0x26	; current row reading backwards
buffB		equ	0x28	; last backward row

; startup
	org 0x0
	goto Main
; interrupt handler
	org 0x4 
IntHandle
	; save registers
	movwf	w_bak
	swapf	STATUS, W
	clrf	STATUS
	movwf	status_bak
	movfw	FSR
	movwf	fsr_bak
	
	btfss	PIR1, TMR1IF	; check if timer 1 overflowed
	goto	IntHandle_End	; if not, finish up interrupt handling
Timer1
	bcf		PIR1, TMR1IF	; clear timer1 interrupt bit

	; look up the value in the character map. 
	call	ForwardString
	movwf	buffF
	clrf	PCLATH		; restore the PCLATH that string tables modify
	call	BackwardString
	movwf	buffB
	clrf	PCLATH		; restore the PCLATH that string tables modify

; output port to 74x259 mappings...
;	PORTA:    S2 S1 S0	(latch selection)
;	PORTC: MR LE DB DF	(Clear/Reset, Enable, Backwards Bit, Forward bit)
;	PORTC:  C  G DB DF

; clear all latches
	movlw	B'0100' ; C = low and G = high to clear all latches  
	movwf	PORTC
	
latchset macro latchnum
	; select the latch
	movlw	latchnum
	movwf	PORTA
	; set the DF and DB data bits
	movlw	B'1000'			; C = high and G = low to set the latch. default DF and DB low.
	btfsc	buffF, latchnum	; check/set forwards bit
	iorlw	1				; DF is high
	btfsc	buffB, latchnum	; check/set backwards bit
	iorlw	2				; DB is high
	movwf	PORTC
	endm

; step through the latch and set the front and back leds.
	latchset 0;
	latchset 1;
	latchset 2;
	latchset 3;
	latchset 4;
	latchset 5;
	latchset 6;
	latchset 7;

latch_done
	bsf		PORTC, 2		; set it to memory mode ('11xx')

Timer1_End
	; reset the timer
#ifdef TESTING 
	movlw	0x00
	movwf	TMR1H
	movwf	TMR1L
#else
	movlw	0x00
	movwf	TMR1L
	movlw	0xF6
	movwf	TMR1H
#endif


IntHandle_End
	; restore all the backed up registers
	movfw	fsr_bak
	movwf	FSR
	swapf	status_bak, W
	movwf	STATUS
	swapf	w_bak, F
	swapf	w_bak, W
	retfie					; return from interrupt

	
Main
	; set Port A and C to all outputs
	bsf		STATUS,	RP0
	clrf	TRISA
	clrf	TRISC
	bcf   	STATUS,	RP0

	; initialize ports with something
	clrf	PORTA 
	clrf	PORTC

	; initalize variables
	clrf	charF
	clrf	rowF
	clrf	charB
	clrf	rowB

	; enable interupts
	bsf		INTCON,	GIE		; enable global interrupts
	bsf		INTCON,	PEIE	; enable peripheral interrupts

	; enable TIMER1 (16bit timer)
	bcf		PIR1,	TMR1IF	; clear timer1 interrupt bit first
#ifdef TESTING 
	; if testing set the prescale to 1:8 to slow down the timer
	bsf		T1CON,	T1CKPS0	
	bsf		T1CON,	T1CKPS1
#else 
	; otherwise set it to 1:1
	bcf		T1CON,	T1CKPS0	
	bcf		T1CON,	T1CKPS1
#endif

	; turn on the timer
	bsf		T1CON,	TMR1ON	
	bsf  	STATUS,	RP0
	; turn on the interrupt
	bsf		PIE1,	TMR1IE	
	bcf   	STATUS,	RP0
	; set the timer
	movlw	0xAA
	movwf	TMR1L
	movlw	0xFF
	movwf	TMR1H


MainLoop
	goto	MainLoop


JumpToChar	macro row, char
	movfw	row		; put the proper row offset in W
	incf	row, F	; increment the row
	goto	char	; jump to the character	
	endm

; force it toward the end of the 2nd page with the forward characters
	org 	0x1D0
ForwardString
	; we're in the second page, so set the PCLATH so computed gotos work correctly
	movlw	HIGH ForwardString	; load high pclath
	movwf	PCLATH				; 	/
	; jumptochar macro uses 3 bytes so multiply index by 3 for correct character
	movfw	charF		; set W = 3 * charF
	addwf	charF, W	;	/
	addwf	charF, W	;	/
	addwf 	PCL, F		; jump to the character
	; characters
#ifdef TESTING 
	JumpToChar rowF, FORWARD_I
	JumpToChar rowF, FORWARD_SWEEP_DOWN
#else 
	JumpToChar rowF, FORWARD_F
	JumpToChar rowF, FORWARD_A
	JumpToChar rowF, FORWARD_S
	JumpToChar rowF, FORWARD_T
	JumpToChar rowF, FORWARD_E
	JumpToChar rowF, FORWARD_R
	JumpToChar rowF, FORWARD_EXCLAIM
	JumpToChar rowF, FORWARD_SPACE
#endif
	; after the last character, wrap back to the first
	clrf	charF
	goto	ForwardString

; force it toward the end of the 3rd page with the forward characters
	org 	0x2D0
BackwardString
	; we're in the second page, so set the PCLATH so computed gotos work correctly
	movlw	HIGH BackwardString	; load high pclath
	movwf	PCLATH	
	; jumptochar macro uses 3 bytes so multiply index by 3 for correct character
	movfw	charB		; set W = 3 * charF
	addwf	charB, W	;	/
	addwf	charB, W	;	/
	addwf 	PCL, F		; jump to the character
	; characters (in reverse order)
#ifdef TESTING 
	JumpToChar rowB, BACKWARD_SWEEP_DOWN
	JumpToChar rowB, BACKWARD_I
#else
	JumpToChar rowB, BACKWARD_SPACE
	JumpToChar rowB, BACKWARD_EXCLAIM
	JumpToChar rowB, BACKWARD_R
	JumpToChar rowB, BACKWARD_E
	JumpToChar rowB, BACKWARD_T
	JumpToChar rowB, BACKWARD_S
	JumpToChar rowB, BACKWARD_A
	JumpToChar rowB, BACKWARD_F
#endif
	; after the last character, wrap back to the first
	clrf	charB
	goto	BackwardString


; ----------------------
; FORWARD CHARACTER MAPS
; ----------------------
; force it into the 2nd page so we don't have to worry about page boundaries when doing computed jumps
	org 	0x100

; finished one character, move to the next
NextForwardChar
	incf	charF, F	; next charF
	clrf	rowF		; rowF = 0
	retlw	0;			; return a gap

FORWARD_SWEEP_DOWN
	addwf	PCL, F
	retlw	B'00000001'
	retlw	B'00000010'
	retlw	B'00000100'
	retlw	B'00001000'
	retlw	B'00010000'
	retlw	B'00100000'
	retlw	B'01000000'
	retlw	B'10000000'
	goto	NextForwardChar
FORWARD_EXCLAIM
	addwf	PCL, F
	retlw	B'10011111'
	goto	NextForwardChar
FORWARD_A
	addwf	PCL, F
	retlw	B'11100000'
	retlw	B'00110000'
	retlw	B'00101100'
	retlw	B'00100011'
	retlw	B'00101100'
	retlw	B'00110000'
	retlw	B'11100000'
	goto	NextForwardChar
FORWARD_B
	addwf	PCL, F
	retlw	B'11111111'
	retlw	B'10001001'
	retlw	B'10001001'
	retlw	B'10001001'
	retlw	B'01110110'
	goto	NextForwardChar
FORWARD_C
	addwf	PCL, F
	retlw	B'00111100'
	retlw	B'01000010'
	retlw	B'10000001'
	retlw	B'10000001'
	retlw	B'01000010'
	goto	NextForwardChar
FORWARD_D
	addwf	PCL, F
	retlw	B'11111111'
	retlw	B'10000001'
	retlw	B'10000001'
	retlw	B'01000010'
	retlw	B'00111100'
	goto	NextForwardChar
FORWARD_E
	addwf	PCL, F
	retlw	B'11111111';
	retlw	B'10001001';
	retlw	B'10001001';
	retlw	B'10001001';
	retlw	B'10000001';
	goto	NextForwardChar
FORWARD_F
	addwf	PCL, F
	retlw	B'11111111';
	retlw	B'00001001';
	retlw	B'00001001';
	retlw	B'00001001';
	retlw	B'00000001';
	goto	NextForwardChar
FORWARD_G
	addwf	PCL, F
	retlw	B'00111100'
	retlw	B'01000010'
	retlw	B'10000001'
	retlw	B'10000001'
	retlw	B'01010010'
	retlw	B'00110000'
	goto	NextForwardChar
FORWARD_H
	addwf	PCL, F
	retlw	B'11111111'
	retlw	B'00001000'
	retlw	B'00001000'
	retlw	B'00001000'
	retlw	B'11111111'
	goto	NextForwardChar
FORWARD_I
	addwf	PCL, F
	retlw	B'11111111'
	goto	NextForwardChar
FORWARD_J
	addwf	PCL, F
	retlw	B'01000000'
	retlw	B'10000000'
	retlw	B'10000000'
	retlw	B'01111111'
	goto	NextForwardChar
FORWARD_K
	addwf	PCL, F
	retlw	B'11111111'
	retlw	B'00001000'
	retlw	B'00000100'
	retlw	B'00011010'
	retlw	B'11100001'
	goto	NextForwardChar
FORWARD_L
	addwf	PCL, F
	retlw	B'11111111'
	retlw	B'10000000'
	retlw	B'10000000'
	retlw	B'10000000'
	goto	NextForwardChar
FORWARD_M
	addwf	PCL, F
	retlw	B'11111111'
	retlw	B'00000010'
	retlw	B'00000100'
	retlw	B'00001000'
	retlw	B'00000100'
	retlw	B'00000010'
	retlw	B'11111111'
	goto	NextForwardChar
FORWARD_N
	addwf	PCL, F
	retlw	B'11111111'
	retlw	B'00000010'
	retlw	B'00000100'
	retlw	B'00001000'
	retlw	B'00010000'
	retlw	B'11111111'
	goto	NextForwardChar
FORWARD_O
	addwf	PCL, F
	retlw	B'00111100'
	retlw	B'01000010'
	retlw	B'10000001'
	retlw	B'10000001'
	retlw	B'01000010'
	retlw	B'00111100'
	goto	NextForwardChar
FORWARD_P
	addwf	PCL, F
	retlw	B'11111111'
	retlw	B'00001001'
	retlw	B'00001001'
	retlw	B'00000110'
	goto	NextForwardChar
FORWARD_Q
	addwf	PCL, F
	retlw	B'00111100'
	retlw	B'01000010'
	retlw	B'10100001'
	retlw	B'10100001'
	retlw	B'01000010'
	retlw	B'10111100'
	retlw	B'10000000'
	goto	NextForwardChar
FORWARD_R
	addwf	PCL, F
	retlw	B'11111111'
	retlw	B'00001001'
	retlw	B'00011001'
	retlw	B'01101001'
	retlw	B'10000110'
	goto	NextForwardChar
FORWARD_S
	addwf	PCL, F
	retlw	B'01000110'
	retlw	B'10001001'
	retlw	B'10001001'
	retlw	B'01110010'
	goto	NextForwardChar
FORWARD_T
	addwf	PCL, F
	retlw	B'00000001'
	retlw	B'00000001'
	retlw	B'11111111'
	retlw	B'00000001'
	retlw	B'00000001'
	goto	NextForwardChar
FORWARD_U
	addwf	PCL, F
	retlw	B'00111111'
	retlw	B'01000000'
	retlw	B'10000000'
	retlw	B'01000000'
	retlw	B'00111111'
	goto	NextForwardChar
FORWARD_V
	addwf	PCL, F
	retlw	B'00000111'
	retlw	B'00111000'
	retlw	B'11000000'
	retlw	B'00111000'
	retlw	B'00000111'
	goto	NextForwardChar
FORWARD_W
	addwf	PCL, F
	retlw	B'00000111'
	retlw	B'00111000'
	retlw	B'11000000'
	retlw	B'00111000'
	retlw	B'11000000'
	retlw	B'00111000'
	retlw	B'00000111'
	goto	NextForwardChar
FORWARD_X
	addwf	PCL, F
	retlw	B'11000011'
	retlw	B'00100100'
	retlw	B'00011000'
	retlw	B'00100100'
	retlw	B'11000011'
	goto	NextForwardChar
FORWARD_Y
	addwf	PCL, F
	retlw	B'00000011'
	retlw	B'00001100'
	retlw	B'11110000'
	retlw	B'00001100'
	retlw	B'00000011'
	goto	NextForwardChar
FORWARD_Z
	addwf	PCL, F
	retlw	B'10000001'
	retlw	B'11100001'
	retlw	B'10011001'
	retlw	B'10000111'
	retlw	B'10000001'
	goto	NextForwardChar
FORWARD_SPACE
	addwf	PCL, F
	retlw	B'00000000'
	retlw	B'00000000'
	retlw	B'00000000'
	retlw	B'00000000'
	retlw	B'00000000'
	goto	NextForwardChar





; -----------------------
; BACKWARD CHARACTER MAPS
; -----------------------

; force it into the 3rd page so we don't have to worry about page boundaries when doing computed jumps
	org 	0x200

; finished one character, move to the next
NextBackwardChar
	incf	charB, F	; next charF
	clrf	rowB		; rowF = 0
	retlw	0;	

BACKWARD_SWEEP_DOWN
	addwf	PCL, F
	retlw	B'10000000'
	retlw	B'01000000'
	retlw	B'00100000'
	retlw	B'00010000'
	retlw	B'00001000'
	retlw	B'00000100'
	retlw	B'00000010'
	retlw	B'00000001'
	goto	NextBackwardChar
BACKWARD_EXCLAIM
	addwf	PCL, F
	retlw	B'10011111'
	goto	NextBackwardChar
BACKWARD_A
	addwf	PCL, F
	retlw	B'11100000'
	retlw	B'00110000'
	retlw	B'00101100'
	retlw	B'00100011'
	retlw	B'00101100'
	retlw	B'00110000'
	retlw	B'11100000'
	goto	NextBackwardChar
BACKWARD_B
	addwf	PCL, F
	retlw	B'01110110'
	retlw	B'10001001'
	retlw	B'10001001'
	retlw	B'10001001'
	retlw	B'11111111'
	goto	NextBackwardChar
BACKWARD_C
	addwf	PCL, F
	retlw	B'01000010'
	retlw	B'10000001'
	retlw	B'10000001'
	retlw	B'01000010'
	retlw	B'00111100'
	goto	NextBackwardChar
BACKWARD_D
	addwf	PCL, F
	retlw	B'11111111'
	retlw	B'10000001'
	retlw	B'10000001'
	retlw	B'01000010'
	retlw	B'00111100'
	goto	NextBackwardChar
BACKWARD_E
	addwf	PCL, F
	retlw	B'10000001';
	retlw	B'10001001';
	retlw	B'10001001';
	retlw	B'10001001';
	retlw	B'11111111';
	goto	NextBackwardChar
BACKWARD_F
	addwf	PCL, F
	retlw	B'00000001';
	retlw	B'00001001';
	retlw	B'00001001';
	retlw	B'00001001';
	retlw	B'11111111';
	goto	NextBackwardChar
BACKWARD_G
	addwf	PCL, F
	retlw	B'00110000'
	retlw	B'01010010'
	retlw	B'10000001'
	retlw	B'10000001'
	retlw	B'01000010'
	retlw	B'00111100'
	goto	NextBackwardChar
BACKWARD_H
	addwf	PCL, F
	retlw	B'11111111'
	retlw	B'00001000'
	retlw	B'00001000'
	retlw	B'00001000'
	retlw	B'11111111'
	goto	NextBackwardChar
BACKWARD_I
	addwf	PCL, F
	retlw	B'11111111'
	goto	NextBackwardChar
BACKWARD_J
	addwf	PCL, F
	retlw	B'01111111'
	retlw	B'10000000'
	retlw	B'10000000'
	retlw	B'01000000'
	goto	NextBackwardChar
BACKWARD_K
	addwf	PCL, F
	retlw	B'11100001'
	retlw	B'00011010'
	retlw	B'00000100'
	retlw	B'00001000'
	retlw	B'11111111'
	goto	NextBackwardChar
BACKWARD_L
	addwf	PCL, F
	retlw	B'10000000'
	retlw	B'10000000'
	retlw	B'10000000'
	retlw	B'11111111'
	goto	NextBackwardChar
BACKWARD_M
	addwf	PCL, F
	retlw	B'11111111'
	retlw	B'00000010'
	retlw	B'00000100'
	retlw	B'00001000'
	retlw	B'00000100'
	retlw	B'00000010'
	retlw	B'11111111'
	goto	NextBackwardChar
BACKWARD_N
	addwf	PCL, F
	retlw	B'11111111'
	retlw	B'00010000'
	retlw	B'00001000'
	retlw	B'00000100'
	retlw	B'00000010'
	retlw	B'11111111'
	goto	NextBackwardChar
BACKWARD_O
	addwf	PCL, F
	retlw	B'00111100'
	retlw	B'01000010'
	retlw	B'10000001'
	retlw	B'10000001'
	retlw	B'01000010'
	retlw	B'00111100'
	goto	NextBackwardChar
BACKWARD_P
	addwf	PCL, F
	retlw	B'00000110'
	retlw	B'00001001'
	retlw	B'00001001'
	retlw	B'11111111'
	goto	NextBackwardChar
BACKWARD_Q
	addwf	PCL, F
	retlw	B'10000000'
	retlw	B'10111100'
	retlw	B'01000010'
	retlw	B'10100001'
	retlw	B'10100001'
	retlw	B'01000010'
	retlw	B'00111100'
	goto	NextBackwardChar
BACKWARD_R
	addwf	PCL, F
	retlw	B'10000110'
	retlw	B'01101001'
	retlw	B'00011001'
	retlw	B'00001001'
	retlw	B'11111111'
	goto	NextBackwardChar
BACKWARD_S
	addwf	PCL, F
	retlw	B'01110010'
	retlw	B'10001001'
	retlw	B'10001001'
	retlw	B'01000110'
	goto	NextBackwardChar
BACKWARD_T
	addwf	PCL, F
	retlw	B'00000001'
	retlw	B'00000001'
	retlw	B'11111111'
	retlw	B'00000001'
	retlw	B'00000001'
	goto	NextBackwardChar
BACKWARD_U
	addwf	PCL, F
	retlw	B'00111111'
	retlw	B'01000000'
	retlw	B'10000000'
	retlw	B'01000000'
	retlw	B'00111111'
	goto	NextBackwardChar
BACKWARD_V
	addwf	PCL, F
	retlw	B'00000111'
	retlw	B'00111000'
	retlw	B'11000000'
	retlw	B'00111000'
	retlw	B'00000111'
	goto	NextBackwardChar
BACKWARD_W
	addwf	PCL, F
	retlw	B'00000111'
	retlw	B'00111000'
	retlw	B'11000000'
	retlw	B'00111000'
	retlw	B'11000000'
	retlw	B'00111000'
	retlw	B'00000111'
	goto	NextBackwardChar
BACKWARD_X
	addwf	PCL, F
	retlw	B'11000011'
	retlw	B'00100100'
	retlw	B'00011000'
	retlw	B'00100100'
	retlw	B'11000011'
	goto	NextBackwardChar
BACKWARD_Y
	addwf	PCL, F
	retlw	B'00000011'
	retlw	B'00001100'
	retlw	B'11110000'
	retlw	B'00001100'
	retlw	B'00000011'
	goto	NextBackwardChar
BACKWARD_Z
	addwf	PCL, F
	retlw	B'10000001'
	retlw	B'10000111'
	retlw	B'10011001'
	retlw	B'11100001'
	retlw	B'10000001'
	goto	NextBackwardChar
BACKWARD_SPACE
	addwf	PCL, F
	retlw	B'00000000'
	retlw	B'00000000'
	retlw	B'00000000'
	retlw	B'00000000'
	retlw	B'00000000'
	goto	NextBackwardChar

	end
