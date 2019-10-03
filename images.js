

window.addEventListener('load', function() {
    console.log('All assets are loaded')
    fetch('/images').then(body => body.json()).then(response => {
        console.log(response)
        response.forEach(element => {
            const img = document.createElement('img');
            img.setAttribute('src', '/bilder/' + element);
            document.querySelector('body').appendChild(img);
        });
        
    })
})