let state = document.getElementById("folButton");
state.addEventListener("click", function(e) {
    console.log("Button: " + "clicked");
    const value = e.target.dataset.follow;
    console.log("The value of dataset: ", value);
    const [
        user,
        fellow,
        action
    ] = value.split(';');

    console.log("From the button click: ", user, fellow, action);
    let data = { follower: user, following: fellow, action: action };
    console.log("This is the data to be sent: ", data);

    (async() => {
        const rawResponse = fetch('/follow', {
            method: "POST",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const content = await rawResponse;

        console.log(content);

        location.reload(true);
    })();
});