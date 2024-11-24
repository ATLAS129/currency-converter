import { useEffect, useState } from "react";

const currencies = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "CHF",
  "UAH",
  "CAD",
  "AUD",
  "CNY",
  "INR",
];

type Currency = {
  currency: string;
  value: string | number;
};

export default function App() {
  const [firstCurrency, setFirstCurrency] = useState<Currency>({
    currency: "USD",
    value: "1",
  });
  const [secondCurrency, setSecondCurrency] = useState<Currency>({
    currency: "EUR",
    value: "1",
  });
  const [timeUpdated, setTimeUpdated] = useState<string>();

  async function fetchCurrency() {
    try {
      const response = await fetch(
        `https://open.er-api.com/v6/latest/${firstCurrency.currency}`
      );

      const result = await response.json();

      if (result && result.rates && result.rates[secondCurrency.currency]) {
        setSecondCurrency({
          ...secondCurrency,
          value: (
            result.rates[secondCurrency.currency] * +firstCurrency.value
          ).toFixed(2),
        });
        setTimeUpdated(
          new Date(result.time_last_update_utc)
            .toString()
            .split(" ")
            .slice(0, 5)
            .join(" ")
        );
      }
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    fetchCurrency();
  }, [
    firstCurrency.currency,
    firstCurrency.value,
    secondCurrency.currency,
    secondCurrency.value,
  ]);

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center">
      <h1>Last time updated: {timeUpdated}</h1>
      <div className="flex border">
        <div>
          <select
            className="border-r p-1"
            onChange={(e) =>
              setFirstCurrency({ ...firstCurrency, currency: e.target.value })
            }
            value={firstCurrency.currency}
          >
            {currencies.map((cur) => (
              <option key={cur} value={cur}>
                {cur}
              </option>
            ))}
          </select>
          <input
            className="border-r p-1"
            type="number"
            value={firstCurrency.value}
            onChange={(e) =>
              setFirstCurrency({ ...firstCurrency, value: e.target.value })
            }
          />
        </div>
        <div>
          <select
            className="border-r p-1"
            onChange={(e) =>
              setSecondCurrency({ ...secondCurrency, currency: e.target.value })
            }
            value={secondCurrency.currency}
          >
            {currencies.map((cur) => (
              <option key={cur} value={cur}>
                {cur}
              </option>
            ))}
          </select>
          <input
            className="p-1"
            type="number"
            value={secondCurrency.value}
            readOnly
          />
        </div>
      </div>
    </div>
  );
}
