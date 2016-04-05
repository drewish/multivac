---
layout: post
title: Hiring advice for dev bootcamp students
---
Back in early April Recurly announced that we were opening a [new office in Boulder](https://recurly.com/press/recurly-expands-to-colorado-opening-new-boulder-colorado-office/). Since then we've hired nine people, five of whom are developers. I've gotten hands on experience with many aspects of recruiting: from passing out business cards at meetups, to phone screens, and technical interviews.

Quite a few of the folks I've met are recent graduates from programs like [gSchool](http://www.galvanize.com/) and [Turing](http://turing.io/). As I've looked through their resumes and projects, I've noticed some common shortcomings and wanted to offer a few thoughts on how to address them. Hopefully it can help folks in these programs find their first developer role.


### Build a portfolio
The projects you work on while you're in the program serve two purposes:

1. To teach you how to build things in a given language and framework.
2. To serve as an example to future employers of the technologies you're familiar with, your awareness of coding standards, and your appreciation of design and UI.

I haven't been through one of these programs but I'm guessing that it'll be hard to focus on both at the same time. My suggestion would be to pick a single project and spend extra time polishing it up and use that as a portfolio piece to share with employers.

**Make it easy to try out** -- I want to poke around on it and see that your code actually works but I'm lazy, and running random code you find on the internet isn't a great idea. So if you built a Rails app put it up on [Heroku](https://www.heroku.com/) or a similar service.

**Make it clear what it's supposed to do** -- Optimize for the first impression. Often you can provide some sample data to demonstrate how it's supposed to work. Try and use real, or at least realistic looking, data. Using the same picture of toast 37 times makes me wonder if something is broken.

**Focus on the user experience** -- Grab a couple people that haven't seen your app before and watch them use it. Do they have a clue what it does? If you give them some tasks are they able to complete them? Once you've got the feedback you'll need to figure out what parts you can incorporate.

**Don't make me create an account** -- I'm glad you learned how to add authentication to a site, do your best to expose the functionality without requiring a login. If your app really needs me to log into an account it might be good to have some screen shots and an overview on your front page. Again, give me an idea of why it's worth the trouble.

**Let me know what part is your work** -- If it's a group project make it clear what part you worked on. If you used an HTML template, make sure to call that out.

After reading through these suggestions it probably sounds like a lot of work... because it is. People have limited time and attention and you need to make it as easy as possible for them to understand and appreciate what's special about your project. But here's the good news: this is *exactly* the same challenge that companies face when selling their products to customers. Spending some time working through these problems will give you an appreciation of marketing, UX, design, and product management.


### Position yourself
When you're writing your resume and cover letter you need to think about how to differentiate yourself from your cohort of graduates. Look back at your previous life of experience and figure out what's relevant to the company and their problems. If your previous job was in finance it's much better to be remembered as the bootcamp grad who was an actuary, rather than just another junior dev.

Don't feel like you need to be a generalist. Most likely your program has taken you through a range of technologies. Think about what you enjoyed working with the most and try to focus on that. Did you love writing CSS? Go spend some time learning more about CSS preprocessors. If you loved building APIs spend some time using different libraries to re-implement the same project so you get a feeling for the strengths and weaknesses. If you loved working with Angular, dive in and write some custom filters and directives.

I liked the way [my old colleague Adrian](http://adrian.schaedle.me/) put it:
> I always think the "specialize early at one thing" is some safe advice. [...] Everyone teaches you all the other crap, mostly because you can help them out on the one thing you know.

We hired him because we needed someone who knew React, so we were happy to get him up to speed on Rails.

### Create a website
Create a website to give me one clear place to find all your stuff. It can be on [GitHub Pages](https://pages.github.com/), a [free Heroku Dyno](https://blog.heroku.com/archives/2015/5/7/heroku-free-dynos), or what ever you're comfortable with. You just want a place where you link off to your projects, LinkedIn, etc.

If you're trying to get a front end role you should spend some time on the markup and styling. It's a great place to show off your chops.


### Write some blog posts
Blog posts are an awesome way to show off your communication and technical writing skills. I'm sure you came across an interesting library while working on a project, or ran into a problem that took hours of Googling to solve. Take those experiences and write up a post.

To use myself as an example, the highest traffic blog post on my site is: [Using cURL and the host header to bypass a load balancer](https://drewish.com/2010/03/29/using-curl-and-the-host-header-to-bypass-a-load-balancer/). After learning and forgetting how to do it twice, I wrote the blog post so I wouldn't have to figure it out a third time. Based on the traffic, it's something a lot of other people are interested in too.


### Use GitHub to show off your work
While I prefer reading a blog post to digging through a git repo, employers will ask for your GitHub URL so you might as well use it to your advantage.

Make sure the GitHub README explains what it should do. If it's a group project explain what part you worked on.

Don't be intimated by other developer's crazy GitHub profiles. You'll see people with contributions to lots of random projects. Know that, for better or worse, most paying work isn't on those kinds of projects. And most corporate work isn't going to be open sourced. For most people GitHub is for side projects.

The workflow I've developed over the last year is to use GitHub's releases like blog posts where I can show off what I've been doing. Here's two C++ projects I've been working on to learn more about OpenGL:

- https://github.com/drewish/Cityscape/releases
- https://github.com/drewish/AlienLander/releases

When I get a particular thing working I tag it and create a release. In the release description I write up what I got working and I include a screen shot. That makes it easy to see a project evolve without having to check out each version.


### Go read other stuff
[On Interviewing as a Junior Dev](http://lizmrush.com/on-interviewing/) has some great reflections on finding and evaluating employers, as well as great hiring advice for employers.

[Every Single Web Portfolio Site Ever](https://medium.com/@_oren/every-single-web-portfolio-site-ever-8fad53534d46) has a list of portfolio site cliches to avoid.

[Designing a landing page that sells](https://blog.activecollab.com/designing-a-landing-page-that-sells-2102afc67024#.7vugz3hc5) is worth reading on two levels: it's got great suggestions you can apply to your website and project README files but it's also a great example of how to sell yourself and your work in a blog post.

[How to Network, in Five Easy Steps](http://best-of-3.blogspot.com/2016/04/how-to-network-in-five-easy-steps.html) is directed at folks working in the arts but I think it applies just as well to the tech world. Stay in touch with the folks you liked in your class, they're the start of your network.
* * *

Thanks to Adrian, Kyra, Rich and Joe for their feedback on this post.
