
## Computer Aided Design (CAD)
There are a lot of different tools you can use to build a 3D model that you can manufacture. 

I've been using Fusion. The free version has some deliberately annoying limitations, but it's a very powerful tool. There's a ton of great video on YouTube to help with the learning curve.

I started off building a few things to 3D print, like this holder for an EV charging cable.
TODO: image

## Computer Aided Manufacturing (CAM)
Once you've got the model, the real fun begins. How do you tell a, relatively dumb, machine that can move a cutter around in space what you want it to do? 

- 2d dumb operations vs 3d model aware ops
- simulate everything

## Orientation
How does the machine know where your stock is relative to the tool? Typically you'll define the origin for the coordinate system at the corner of the stock. If your stock is substantially bigger than your model, you don't need to be too precise. But if you plan on making cuts on both sides then you'll need to have a reference point you can use
- edge finder

## Work holding
How do you keep it in one place?

Been having good success with the double sided painter tape and CA glue technique. If your touch off is accurate you can cut all the way to the spoil board.

I've also just screwed a vice to the spoil board and put my work in it when I needed to cut into the side, like for the opening of a USB port.

## Material
### Wood
With wood you've got a lot to think about: grain, hardness, sanding and finishing. It's harder to retain the level of detail you'd expect on a keyboard. Most designs have finer details that are better off in metal or plastic.

### Plastic
- More detail
- Can be brittle, need to have O-flute cutters to move the chips away so they don't re-melt and stick to your work or the tool and gum it up. I've had great results with [IDC Woodcraft's acrylic bits](https://idcwoodcraft.com/products/acrylic-cnc-router-endmill-bit-set-0-flute-1-8-1-4).