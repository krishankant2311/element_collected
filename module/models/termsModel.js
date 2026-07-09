const mongoose = require("mongoose");

const termsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Terms & Conditions",
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Active", "Deleted"],
      default: "Active",
    },
  },
  { timestamps: true }
);

const Terms = mongoose.model("Terms", termsSchema);

const seedDummyTerms = async () => {
  try {
    const activeTerms = await Terms.find({ status: "Active" }).sort({ updatedAt: -1 });

    if (activeTerms.length > 1) {
      const [latest, ...older] = activeTerms;
      await Terms.updateMany(
        { _id: { $in: older.map((item) => item._id) } },
        { status: "Deleted" }
      );
      console.log("Extra Terms records cleaned up");
      return;
    }

    if (activeTerms.length === 1) {
      console.log("Terms already exist");
      return;
    }

    await Terms.create({
      title: "Terms & Conditions",
      content:
        "By using Jessie's Foundation, you agree to provide accurate information, use the platform responsibly, and follow all community and donation guidelines.",
    });

    console.log("Dummy Terms & Conditions created successfully");
  } catch (error) {
    console.error("Error seeding Terms:", error.message);
  }
};

module.exports = { Terms, seedDummyTerms };
