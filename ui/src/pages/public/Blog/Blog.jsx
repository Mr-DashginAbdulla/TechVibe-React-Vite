import { useTranslation } from "react-i18next";
import { Calendar, ArrowRight, Tag } from "lucide-react";
import { Link } from "react-router-dom";

const posts = [
  {
    category: "Tech Trends",
    title: "Top 10 Tech Products of 2026",
    excerpt:
      "Discover the gadgets that are shaping the future of technology this year.",
    date: "Feb 15, 2026",
    readTime: "5 min",
  },
  {
    category: "Buying Guide",
    title: "How to Choose the Perfect Laptop",
    excerpt:
      "A comprehensive guide to finding the right laptop for your needs and budget.",
    date: "Feb 10, 2026",
    readTime: "8 min",
  },
  {
    category: "Reviews",
    title: "Gaming Headsets: Compared & Ranked",
    excerpt:
      "We tested 12 gaming headsets so you don't have to. Here's our verdict.",
    date: "Feb 5, 2026",
    readTime: "10 min",
  },
  {
    category: "Tips & Tricks",
    title: "Maximize Your Smartphone Battery Life",
    excerpt:
      "Simple habits and settings that can significantly extend your phone's battery.",
    date: "Jan 28, 2026",
    readTime: "4 min",
  },
  {
    category: "Tech Trends",
    title: "The Rise of AI-Powered Wearables",
    excerpt:
      "How artificial intelligence is transforming the wearable technology landscape.",
    date: "Jan 20, 2026",
    readTime: "6 min",
  },
  {
    category: "Buying Guide",
    title: "4K vs 8K Monitors: Is It Worth It?",
    excerpt:
      "Breaking down the real-world differences and whether upgrading makes sense.",
    date: "Jan 15, 2026",
    readTime: "7 min",
  },
];

const categories = [
  "All",
  "Tech Trends",
  "Buying Guide",
  "Reviews",
  "Tips & Tricks",
];

export default function Blog() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen py-[60px] px-[16px]">
      <div className="container mx-auto max-w-[1000px]">
        {/* Header */}
        <div className="text-center mb-[56px]">
          <h1 className="text-[48px] font-black text-foreground mb-[16px]">
            {t("blog.title")}
          </h1>
          <p className="text-[18px] text-muted-foreground max-w-[520px] mx-auto">
            {t("blog.subtitle")}
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-[10px] justify-center mb-[48px]">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-[18px] py-[8px] rounded-full text-[14px] font-semibold transition-all border ${cat === "All" ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]">
          {posts.map((post, i) => (
            <article
              key={i}
              className="group flex flex-col rounded-[20px] overflow-hidden bg-muted border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer"
            >
              {/* Image placeholder with gradient */}
              <div
                className={`h-[180px] bg-linear-to-br ${i % 3 === 0 ? "from-primary/20 to-primary/5" : i % 3 === 1 ? "from-purple-500/20 to-blue-500/5" : "from-cyan-500/20 to-primary/5"} flex items-center justify-center`}
              >
                <span className="text-[48px]">
                  {post.category === "Tech Trends"
                    ? "🚀"
                    : post.category === "Buying Guide"
                      ? "🎯"
                      : post.category === "Reviews"
                        ? "⭐"
                        : "💡"}
                </span>
              </div>

              <div className="p-[24px] flex flex-col flex-1">
                <div className="flex items-center gap-[10px] mb-[12px]">
                  <span className="flex items-center gap-[4px] text-[12px] text-primary font-semibold">
                    <Tag className="w-[12px] h-[12px]" /> {post.category}
                  </span>
                  <span className="text-muted-foreground text-[12px]">·</span>
                  <span className="flex items-center gap-[4px] text-[12px] text-muted-foreground">
                    <Calendar className="w-[12px] h-[12px]" /> {post.date}
                  </span>
                </div>

                <h2 className="text-[16px] font-bold text-foreground mb-[10px] group-hover:text-primary transition-colors leading-snug">
                  {post.title}
                </h2>
                <p className="text-[14px] text-muted-foreground leading-relaxed flex-1 mb-[16px]">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-muted-foreground">
                    {post.readTime} {t("blog.read")}
                  </span>
                  <span className="flex items-center gap-[4px] text-[13px] text-primary font-semibold group-hover:gap-[8px] transition-all">
                    {t("blog.readMore")}{" "}
                    <ArrowRight className="w-[14px] h-[14px]" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-[48px]">
          <button className="px-[32px] py-[14px] rounded-[12px] border border-border text-foreground font-semibold hover:bg-muted hover:border-primary/30 transition-all">
            {t("blog.loadMore")}
          </button>
        </div>
      </div>
    </div>
  );
}
