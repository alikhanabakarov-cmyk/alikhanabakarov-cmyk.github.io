(() => {
  const rate = document.getElementById("earningRate");
  const shifts = document.getElementById("earningShifts");
  const rateValue = document.getElementById("earningRateValue");
  const shiftsValue = document.getElementById("earningShiftsValue");
  const total = document.getElementById("earningTotal");
  if (!rate || !shifts || !rateValue || !shiftsValue || !total) return;

  const rubles = new Intl.NumberFormat("ru-RU");
  const update = () => {
    const rateNumber = Number(rate.value);
    const shiftCount = Number(shifts.value);
    rateValue.textContent = `${rubles.format(rateNumber)} ₽`;
    shiftsValue.textContent = `${rubles.format(shiftCount)} смен`;
    total.textContent = `${rubles.format(rateNumber * shiftCount)} ₽`;

    for (const input of [rate, shifts]) {
      const min = Number(input.min);
      const max = Number(input.max);
      const percent = ((Number(input.value) - min) / (max - min)) * 100;
      input.style.background = `linear-gradient(90deg, #f1a33b 0 ${percent}%, #365e57 ${percent}% 100%)`;
    }
  };

  rate.addEventListener("input", update);
  shifts.addEventListener("input", update);
  update();
})();
