global.convertMutations = (obj) => {
    if(isArray(obj)) {
        return obj.map(convertMutations);
    } else  if (typeof obj === 'object' && !isNullable(obj)) {
        let newObj = {};
        const keys = Object.keys(obj);
        for (let n = 0; n < keys.length; n++) {
            const key = keys[n];
            let value = obj[key];
            if(isDate(value)) {
                value = Dates.parse(value);
            } else if(isArray(value)) {
                value = value.map(convertMutations);
            } else if (typeof value === 'object' && !isNullable(value)) {
                value = convertMutations(value);
            } else {
                if (key === 'id' || (key.endsWith('_id') && key !== 'auth_id')) {
                    value = convertIdToBigint(value);
                } else if (key.endsWith('_list') && isNullable(value)) {
                    value = [];
                }
            }
            if(key !== "__typename") {
                newObj[key] = value;
            }
        }
        return newObj;
    }
    return obj;
};
