const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Active", "Deleted"],
      default: "Active",
    },
  },
  { timestamps: true }
);

const Faq = mongoose.model("Faq", faqSchema);

const seedDummyFaqs = async () => {
  try {
    const count = await Faq.countDocuments();
    if (count > 0) {
      console.log("FAQs already exist");
      return;
    }

    await Faq.insertMany([
      {
        question: "What is Jessie's Foundation?",
        answer:
          "Jessie's Foundation is a non-profit organization focused on education, health, and community development.",
        order: 1,
      },
      {
        question: "How can I donate?",
        answer:
          "You can donate through our active fundraising campaigns in the app or website using secure payment options.",
        order: 2,
      },
      {
        question: "How do I become a member?",
        answer:
          "Go to the Membership section, choose a plan (Monthly, Quarterly, or Yearly), and complete the subscription process.",
        order: 3,
      },
      {
        question: "Where can I watch foundation videos?",
        answer:
          "Visit the Videos section to explore categories, featured content, and latest impact stories.",
        order: 4,
      },
      {
        question: "Is my donation tax deductible?",
        answer:
          "Yes, eligible donations may be tax deductible. You will receive a receipt after successful contribution.",
        order: 5,
      },
      {
        question: "How do I contact support?",
        answer:
          "You can reach our support team through the Contact section in the app or email support@jessiesfoundation.org.",
        order: 6,
      },
    ]);

    console.log("Dummy FAQs created successfully");
  } catch (error) {
    console.error("Error seeding FAQs:", error.message);
  }
};

module.exports = { Faq, seedDummyFaqs };
