const Record = require("../models/Record");

//  Create Record
exports.createRecord = async (req, res) => {
  try {
    const { amount, type, category, date, note } = req.body;

    const record = await Record.create({
      amount,
      type,
      category,
      date,
      note,
      user: req.user._id,
    });

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Get Records (with filters)
 
//  Update Record
exports.updateRecord = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    const updated = await Record.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Delete Record
exports.deleteRecord = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    await record.deleteOne();

    res.json({ message: "Record deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//  Dashboard Summary
 exports.getDashboard = async (req, res) => {
  try {
    const records = await Record.find({ user: req.user._id });

    let totalIncome = 0;
    let totalExpense = 0;
    let categoryMap = {};

    records.forEach((rec) => {
      if (rec.type === "income") {
        totalIncome += rec.amount;
      } else {
        totalExpense += rec.amount;
      }

      if (!categoryMap[rec.category]) {
        categoryMap[rec.category] = 0;
      }
      categoryMap[rec.category] += rec.amount;
    });

    const netBalance = totalIncome - totalExpense;

    res.json({
      totalIncome,
      totalExpense,
      netBalance,
      categoryBreakdown: categoryMap,
      totalTransactions: records.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRecords = async (req, res) => {
  try {
    const { type, category, startDate, endDate } = req.query;

    let filter = {};

    if (type) filter.type = type;
    if (category) filter.category = category;

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const records = await Record.find(filter).sort({ date: -1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
