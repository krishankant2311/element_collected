const mongoose = require("mongoose");

const privacySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Privacy Policy",
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

const Privacy = mongoose.model("Privacy", privacySchema);

const seedDummyPrivacy = async () => {
  try {
    const activePrivacy = await Privacy.find({ status: "Active" }).sort({ updatedAt: -1 });

    if (activePrivacy.length > 1) {
      const [latest, ...older] = activePrivacy;
      await Privacy.updateMany(
        { _id: { $in: older.map((item) => item._id) } },
        { status: "Deleted" }
      );
      console.log("Extra Privacy Policy records cleaned up");
      return;
    }

    if (activePrivacy.length === 1) {
      console.log("Privacy Policy already exists");
      return;
    }

    await Privacy.create({
      title: "Privacy Policy",
      content:
        "We collect only necessary user data to provide and improve our services. Your personal information is never sold to third parties. You may request access, correction, or deletion of your data by contacting support.",
    });

    console.log("Dummy Privacy Policy created successfully");
  } catch (error) {
    console.error("Error seeding Privacy Policy:", error.message);
  }
};

module.exports = { Privacy, seedDummyPrivacy };
