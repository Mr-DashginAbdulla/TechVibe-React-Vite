import { useTranslation } from "react-i18next";

const SpecsTable = ({ specs = {} }) => {
  const { t } = useTranslation();

  const specEntries = Object.entries(specs);

  if (specEntries.length === 0) return null;

  const translateSpecKey = (key) => {
    const translationKey = `specs.${key.replace(/\s+/g, "")}`;
    const translation = t(translationKey, { defaultValue: "" });
    return translation || key;
  };

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-foreground mb-1">
        {t("productDetails.specifications")}
      </h2>
      <p className="text-muted-foreground mb-6">
        {t("productDetails.specsSubtitle")}
      </p>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="grid grid-cols-2 bg-muted/50 border-b border-border">
          <div className="px-6 py-3 text-sm font-semibold text-foreground">
            {t("productDetails.specification")}
          </div>
          <div className="px-6 py-3 text-sm font-semibold text-foreground">
            {t("productDetails.details")}
          </div>
        </div>

        <div className="divide-y divide-border">
          {specEntries.map(([key, value], idx) => (
            <div
              key={key}
              className={`grid grid-cols-2 ${
                idx % 2 === 0 ? "bg-card" : "bg-muted/30"
              }`}
            >
              <div className="px-6 py-4 text-sm font-medium text-foreground">
                {translateSpecKey(key)}
              </div>
              <div className="px-6 py-4 text-sm text-muted-foreground">
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpecsTable;
