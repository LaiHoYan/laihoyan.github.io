const pieCharts = Array.from(document.querySelectorAll('[data-pie-chart]'));

pieCharts.forEach((pie) => {
  const percentage =60;// = Math.floor(Math.random() * 100); // Get random percentage
  const mainSegment = pie.querySelector('[data-segment-main]'); // Get main/colored segment
  const secondarySegment = pie.querySelector('[data-segment-secondary]'); // Get secondary/white segment
  const radius = parseInt(mainSegment.getAttribute('r'), 10); // Get radius of circle to calculate circumference
  const circumference = 2 * Math.PI * radius;
  const percentageOffset = ((circumference * (percentage / 100)) + circumference) * -1; // Offset the stroke according to the percentage, negative to go clockwise
  const circumferenceSecondary = circumference * ((100 - percentage - 5) / 100); // Get remaining length around circle and add in 5% of extra space or 2.5% on either side secondary line
  const percentageOffsetSecondary = percentageOffset - (circumference * 0.025); // Calculate offset to position the line with 2.5% space on either side

  mainSegment.style.strokeDasharray = circumference;
  mainSegment.style.strokeDashoffset = percentageOffset;

  secondarySegment.style.strokeDasharray = `${circumferenceSecondary} ${circumference - circumferenceSecondary}`;
  secondarySegment.style.strokeDashoffset = percentageOffsetSecondary;
});




const chartContainer = document.getElementById('chartContainer');
const addChartButton = document.getElementById('addChart');
const exportAllButton = document.getElementById('exportAll');

let chartId = 0;

function createChart(id) {
  const container = document.createElement('div');
  container.classList.add('container','green');
  container.id = `chart-${id}`;

  container.innerHTML = `
    <svg width="200" height="200" viewBox="0 0 450 450" xmlns="http://www.w3.org/2000/svg" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;overflow:visible;
    margin: 20px auto;">
      <defs>
        <filter id="goo-${id}">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 15 -3" result="goo" />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </defs>
      <circle class="stroke-secondary" filter="url(#goo-${id})" r="200" data-segment-secondary></circle>
      <circle class="stroke-main" filter="url(#goo-${id})" r="200" data-segment-main></circle>
    </svg>
    <div>
      <input type="number" min="0" max="100" value="50" data-percentage id="percentage-${id}" />
      <button onclick="removeChart(${id})">Remove</button>
      <button onclick="exportChart(${id})">Export PNG</button>
    </div>
  `;

  chartContainer.appendChild(container);
  updateChart(id, 50); // Default percentage is 50
}

function removeChart(id) {
  const chart = document.getElementById(`chart-${id}`);
  if (chart) {
    chartContainer.removeChild(chart);
  }
}

function updateChart(id, percentage) {
  const chart = document.getElementById(`chart-${id}`);
  if (!chart) return;

  const mainSegment = chart.querySelector('[data-segment-main]');
  const secondarySegment = chart.querySelector('[data-segment-secondary]');
  const radius = parseInt(mainSegment.getAttribute('r'), 10);
  const circumference = 2 * Math.PI * radius;
  const percentageOffset = ((circumference * (percentage / 100)) + circumference) * -1;
  const circumferenceSecondary = circumference * ((100 - percentage - 5) / 100);
  const percentageOffsetSecondary = percentageOffset - (circumference * 0.025);

  mainSegment.style.strokeDasharray = circumference;
  mainSegment.style.strokeDashoffset = percentageOffset;
  secondarySegment.style.strokeDasharray = `${circumferenceSecondary} ${circumference - circumferenceSecondary}`;
  secondarySegment.style.strokeDashoffset = percentageOffsetSecondary;
}

function exportChart(id) {
  const chart = document.getElementById(`chart-${id}`).querySelector('svg');
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const svgString = new XMLSerializer().serializeToString(chart);
  const img = new Image();

  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0);
    const a = document.createElement('a');
    a.download = `chart-${id}.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
  };

  img.src = 'data:image/svg+xml;base64,' + btoa(svgString);
}

function exportAllCharts() {
  const charts = document.querySelectorAll('.container svg');
  charts.forEach((chart, index) => {
    exportChart(index);
  });
}

addChartButton.addEventListener('click', () => {
  createChart(chartId++);
});

exportAllButton.addEventListener('click', exportAllCharts);

chartContainer.addEventListener('input', (event) => {
  if (event.target.matches('[data-percentage]')) {
    const id = event.target.id.split('-')[1];
    const percentage = parseInt(event.target.value, 10);
    updateChart(id, percentage);
  }
});

// Add the initial chart
createChart(chartId++);