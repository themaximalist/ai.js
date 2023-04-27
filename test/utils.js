async function expectStream(stream, value) {
    let response = "";
    for await (const token of stream) {
        response += token;
        if (response.toLowerCase().indexOf(value) !== -1) {
            return true;
        }
    }
    return false;
}

module.exports = { expectStream };