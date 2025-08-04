const blockMongoOperators = (value) => {
    if (/\$|\./.test(value)) {
      throw new Error('Invalid characters detected: "$" or "." are not allowed');
    } 
    return value;
};

module.exports = blockMongoOperators;