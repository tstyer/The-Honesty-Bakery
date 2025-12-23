# Honesty Bakery

The Honesty Bakehouse is a local cake and sweet store which I have built this full-stack website for. Built with React, it caters to all audiences who pass the physical shop. There are limitedf pages, but it is consistent in design and offers an intuitive layout. 

--- 

## Testing 

This section documents full-scope testing, from beginning to end of production, using manual and automated tests. 

### Manual Testing

### Automated Testing

#### Jest

#### Python Tests

#### Django Tests

### Bugs

#### Frontend Bugs

1. Product Display Bug

![Screenshot of bug](/resources/images/product_display-bug.png)

The above image shows a classic bug caused by using Javascript Style comments within a JSX sextion. To remove this problem, I simply put curly braces around the Javascript style comments within thye JSX section, and it was resolved. 

Here it is fixed:

![Screenshot of resolution](/resources/images/product_display_big_fixed.png)

2. Product Screen (First bug)

![Screenshot of bug](/resources/images/product_screen_bug1.png)

The error is clear - 'Product' is not recognised. So, to solve this, I did some searching and found that the error was simple: misspelled 'product' as 'Product'. 

![Screenshot of error](/resources/images/product_screen_bug1_error_found.png)

So I changed it to as lower-case p, and it worked:

![Bug Resolved](/resources/images/product_screen_bug_resolved.png)

3. Go Back Button

![Screenshot of bug](/resources/images/goback_bug.png)

This above image shows a blank screen, but there should be a 'Go Back' button listed, as that is what I had coded to be returned on this page. I learned that this was due to the spelling of a className used in the link: 'btn-Light' should be 'btn-light'. 

![Screenshopt of bug](/resources/images/goback_bug_error.png)

Solved:

![Solved screenshot](/resources/images/goback_solved.png)

#### Backend Bugs

--- 

## Tech. Used

1. HTML5
2. CSS3
3. ReactBoostrap, found (https://react-bootstrap.netlify.app/)[here].
4. Bootswatch.
5. React.js
6. JavaScript