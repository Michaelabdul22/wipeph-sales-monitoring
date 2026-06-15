'use client';

import { useEffect, useRef, useState } from 'react';
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip
} from 'chart.js';

Chart.register(LineController, BarController, LineElement, BarElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Filler);

const colors = ['#FF5733', '#33FF57', '#3357FF', '#FFD700', '#C0C0C0', '#808080'];

export default function DashboardCharts({ chartData, bestSellingName }) {
  const [period, setPeriod] = useState('daily');
  const salesCanvas = useRef(null);
  const serviceCanvas = useRef(null);
  const salesChart = useRef(null);
  const serviceChart = useRef(null);

  useEffect(() => {
    if (!salesCanvas.current) return;
    const data = chartData.periods[period];
    if (salesChart.current) salesChart.current.destroy();
    salesChart.current = new Chart(salesCanvas.current, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [{
          label: data.title,
          data: data.data,
          borderColor: '#FFD700',
          backgroundColor: 'rgba(255, 215, 0, 0.12)',
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: '#fff',
          pointBorderColor: '#FFD700',
          pointBorderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 500 },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label(context) {
                return `₱${Number(context.raw || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback(value) {
                return `₱${Number(value).toLocaleString('en-PH')}`;
              }
            }
          }
        }
      }
    });

    return () => salesChart.current?.destroy();
  }, [chartData, period]);

  useEffect(() => {
    if (!serviceCanvas.current) return;
    if (serviceChart.current) serviceChart.current.destroy();
    serviceChart.current = new Chart(serviceCanvas.current, {
      type: 'bar',
      data: {
        labels: chartData.services.labels,
        datasets: [{
          data: chartData.services.data,
          backgroundColor: colors,
          borderColor: '#000',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
    return () => serviceChart.current?.destroy();
  }, [chartData]);

  return (
    <>
      <section className="chart-container">
        <div className="chart-header-custom">
          <h3 className="chart-title">Sales Analytics</h3>
          <div className="custom-segmented-control">
            {['daily', 'weekly', 'monthly', 'yearly'].map(item => (
              <button
                type="button"
                key={item}
                className={`segmented-btn ${period === item ? 'active' : ''}`}
                onClick={() => setPeriod(item)}
              >
                <span className="chart-legend-box" />
                {item[0].toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="chart-canvas-wrap">
          <canvas ref={salesCanvas} />
        </div>
      </section>

      <section className="small-chart-container bottom-charts">
        <div className="chart-header-custom">
          <h3 className="chart-title">Best Selling Service: <span className="best-selling-badge">{bestSellingName}</span></h3>
        </div>
        <div className="chart-canvas-wrap small">
          <canvas ref={serviceCanvas} />
        </div>
      </section>
    </>
  );
}
