import crypto from 'crypto';


export default async function graVatar(email) {
    let image;
    if (!email) email = "example@hotmail.com";
    /* Generate a md5-hash of a email address and return its hexadecimal value */
    var hash = crypto.createHash('md5').update(email).digest("hex");

    /* Sends a GET request for a user's avatar */
    const response = fetch("https://www.gravatar.com/avatar/" + hash + ".jpg");
    console.log("Got image: " + response);
    const { url } = response;
    console.log(url);
    image = response;
    return image;

};