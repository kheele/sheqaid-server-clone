
global.convertIdToBigint = (encodedHasuraRelayID) => {
    try {
        if (isNumber(encodedHasuraRelayID)) return encodedHasuraRelayID;

        const decodedRelayID = atob(encodedHasuraRelayID);
        const relayIdAsArray = JSON.parse(decodedRelayID);
        const actualDatabaseID = relayIdAsArray[3];
        // console.log(decodedRelayID); // "[1, \"lifeplan\", \"status_plan_header\", 1]"
        // console.log(relayIdAsArray); // [1, "lifeplan", "status_plan_header", 1]
        // console.log(actualDatabaseID); // 1  (the actual database ID)!
        return actualDatabaseID;
    } catch(err) {
        // console.error('convertIdToBigint', encodedHasuraRelayID, err);
        return encodedHasuraRelayID;
    }
};