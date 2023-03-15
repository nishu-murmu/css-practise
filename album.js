function onClick() {
    let list = []
    document.getElementById("hamburger").addEventListener("click", function() {
        document.getElementById("collapsible-navbar").classList.toggle("show");
    })
}
onClick()