const couterModel = require('../models/counterModel');

const getNextSequence = async (sequenceName) => {
  const sequenceDoc = await couterModel.findOneAndUpdate(
    { modelName: sequenceName },
    { $inc: { sequenceValue: 1 } },
    { returnOriginal: false }
  );

  return sequenceDoc.sequenceValue;
};

module.exports = getNextSequence;
