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
    const count = await Terms.countDocuments();
    if (count > 0) {
      console.log("Terms already exist");
      return;
    }

    await Terms.insertMany([
      {
        title: "Terms & Conditions",
        content:
          "By using Jessie's Foundation, you agree to follow platform rules, provide accurate account information, and use services responsibly.",
      },
      {
        title: "Privacy Policy",
        content:
          "We collect only necessary user data to improve services. Your personal information is never sold to third parties.",
      },
      {
        title: "Donation Policy",
        content:
          "All donations are used for approved foundation programs. Donors receive confirmation and periodic impact updates.",
      },
      {
        title: "Membership Policy",
        content:
          "Membership plans include defined benefits by tier. Users can upgrade, renew, or cancel as per billing terms.",
      },
      {
        title: "Community Guidelines",
        content:
          "Users must post respectfully in forums and comments. Hate speech, spam, and abusive behavior are not allowed.",
      },
      {
        title: "Refund Policy",
        content:
          "Membership refunds are handled case-by-case within 7 days of billing. Donation refunds follow legal and campaign rules.",
      },
    ]);

    console.log("Dummy Terms content created successfully");
  } catch (error) {
    console.error("Error seeding Terms:", error.message);
  }
};

module.exports = { Terms, seedDummyTerms };
