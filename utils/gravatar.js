import crypto from 'crypto';

export default async function graVatar(email) {
    let image;
    if (!email) email = "example@hotmail.com";
    /* Generate a md5-hash of a email address and return its hexadecimal value */
    var hash = crypto.createHash('md5').update(email).digest("hex");

    /* Sends a GET request for a user's avatar */
    const response = fetch("https://www.gravatar.com/avatar/" + hash + ".jpg");
    const { url } = response;
    image = response;
    return image;

};
