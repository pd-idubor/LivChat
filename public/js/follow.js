(function() {
    let state = document.getElementById("folButton");
    if (!state) {
        return;
    }
    state.addEventListener("click", function(e) {
        const value = e.target.dataset.follow;
        const [
            user,
            fellow,
            action
        ] = value.split(';');

        let data = { follower: user, following: fellow, action: action };
        (async() => {
            const rawResponse = fetch('/follow', {
                method: "POST",
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const content = await rawResponse;

            if (!content) {
                return (console.log("An error occured."));
            };

            location.reload(true);
        })();
    });
})();