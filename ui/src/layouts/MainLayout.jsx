import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";

const MainLayout = () => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col">
      <Helmet>
        <title>TechVibe - {t("home.heroTitle")}</title>
        <meta name="description" content={t("footer.description")} />
      </Helmet>
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
