import { useTranslation } from "react-i18next";

const SpecsTable = ({ specs = {} }) => {
  const { t } = useTranslation();

  const specEntries = Object.entries(specs);

  if (specEntries.length === 0) return null;

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-1">
        {t("productDetails.specifications")}
      </h2>
      <p className="text-gray-500 mb-6">{t("productDetails.specsSubtitle")}</p>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-2 bg-gray-50 border-b border-gray-200">
          <div className="px-6 py-3 text-sm font-semibold text-gray-900">
            {t("productDetails.specification")}
          </div>
          <div className="px-6 py-3 text-sm font-semibold text-gray-900">
            {t("productDetails.details")}
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-100">
          {specEntries.map(([key, value], idx) => (
            <div
              key={key}
              className={`grid grid-cols-2 ${
                idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
              }`}
            >
              <div className="px-6 py-4 text-sm font-medium text-gray-700">
                {key}
              </div>
              <div className="px-6 py-4 text-sm text-gray-600">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpecsTable;
