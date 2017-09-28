document.addEventListener("DOMContentLoaded", function(event) {
  MutationObserver = window.MutationObserver ;
    var observer = new MutationObserver( function (mutations) {
      var images = document.body.getElementsByTagName("img");          
      console.log("mutation fired", mutations)
      var elements = document.getElementsByClassName("filled");
      console.log("MUTMUT",elements);
      for (var i=0; i < elements.length; ++i) {
        console.log("obj bi", elements[i])
        var [a, prefix, pathLocal]  = getComputedStyle(elements[1]).backgroundImage.match(/url\(\"(.*)(\/assets.*)/);
        console.log(a, prefix, pathLocal)
        if (prefix !== global.path && elements[i].style.backgroundImage !== "url(\""+global.path+pathLocal) {
          console.log("replacing bi !")
          elements[i].style.backgroundImage="url(\""+global.path+pathLocal
        } else {
          console.log( "do nothing", i, images[i].src)
        }
      }
      for (var i=0; i < images.length; ++i) {        
        console.log("replace image", i, images[i])        
        var [a, prefix, pathLocal] = images[i].src.match(/file\:\/\/(.*)(\/assets.*)/);
        console.log(a, prefix, pathLocal)
        if (prefix !== global.path) {
          console.log("replacing !")
          images[i].setAttribute("src", global.path+pathLocal)
        } else {
          console.log( "do nothing", i, images[i].src)
        }
      }
    }
  )
  observer.observe(document, {
    subtree: true,
    attributes: true
  })
});
