import { createSignal, createEffect, For } from 'solid-js';
import { useParams, useNavigate, useLocation } from '@solidjs/router';
import { API, useAppContext } from '../context';
import Header from '../components/Header';
import { SolidApexCharts } from 'solid-apexcharts';
import { Icon } from '@iconify-icon/solid';

export default function Dashboard() {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const context = useAppContext()!;

  const [metrics, setMetrics] = createSignal([
    { label: 'Users Online', value: 23, icon: 'mdi:account' },
    { label: 'Server Load', value: '47%', icon: 'mdi:server' },
    { label: 'Active Jobs', value: 12, icon: 'tabler:briefcase' },
    { label: 'Errors Today', value: 0, icon: 'ic:baseline-error-outline' },
  ]);

  const [entries, setEntries] = createSignal([
    {
      id: 1,
      title: 'System Status',
      content: 'All systems operational.',
      timestamp: '2025-05-30 09:00',
    },
    {
      id: 2,
      title: 'User Activity',
      content: '15 users logged in within the last hour.',
      timestamp: '2025-05-30 08:45',
    },
    {
      id: 3,
      title: 'Error Logs',
      content: '0 critical errors reported today.',
      timestamp: '2025-05-30 08:30',
    },
  ]);

  const chartOptions = {
    chart: {
      type: 'line',
      toolbar: { show: false },
      zoom: { enabled: false },
      background: '#171717', // bg-neutral-900 hex value
    },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      labels: { style: { colors: '#9CA3AF' } }, // Tailwind text-neutral-400 for axis labels
    },
    yaxis: {
      labels: { style: { colors: '#9CA3AF' } },
    },
    stroke: {
      curve: 'smooth',
      colors: ['#3B82F6'], // Tailwind blue-500 for line color
    },
    theme: {
      mode: 'dark',
    },
    grid: {
      borderColor: '#374151', // Tailwind neutral-700 for grid lines
    },
  };

  const chartSeries = [
    {
      name: 'Active Users',
      data: [10, 41, 35, 51, 49],
    },
  ];

  const lineChartOptions = {
    chart: {
      id: 'line-chart',
      toolbar: { show: false },
      background: '#171717', // bg-neutral-900 hex value
    },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    theme: {
      mode: 'dark',
    },
    colors: ['#4F46E5'], // Indigo-600
    tooltip: {
      enabled: true,
    },
  };

  const lineChartSeries = [
    {
      name: 'Active Users',
      data: [30, 40, 35, 50, 49, 60, 70],
    },
  ];

  // Sample data for bar chart
  const barChartOptions = {
    chart: {
      id: 'bar-chart',
      toolbar: { show: false },
    },
    xaxis: {
      categories: ['Q1', 'Q2', 'Q3', 'Q4'],
    },
    colors: ['#22C55E'], // Green-500
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: '45%',
      },
    },
    tooltip: {
      enabled: true,
    },
  };

  const barChartSeries = [
    {
      name: 'Sales',
      data: [15000, 20000, 18000, 22000],
    },
  ];

  return (
    <div class="flex h-screen flex-col bg-white dark:bg-neutral-900 dark:text-white">
      <Header />

      {/* Entry Logs */}
      <div class="flex-1 overflow-auto scroll-smooth px-4 py-4 space-y-4 mt-2 mb-6">
        <h1 class="leading-0 uppercase tracking-widest text-2xl mt-6 mb-10 px-4">
          <b>Dash</b>board
        </h1>
        {/* Metrics Cards */}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 mt-4">
          <For each={metrics()}>
            {(metric) => (
              <div class="rounded-2xl bg-neutral-100 dark:bg-neutral-800 p-4 shadow-md flex items-center space-x-4">
                <Icon icon={metric.icon} width="50" height="50" class="text-yellow-500 shrink-0" />
                <div class="flex flex-col">
                  <span class="text-lg text-neutral-500">{metric.label}</span>
                  <span class="text-4xl font-semibold">{metric.value}</span>
                </div>
              </div>
            )}
          </For>
        </div>

        <div class="grid grid-cols-1 gap-4 px-4 mt-4">
          <div class="bg-neutral-100 dark:bg-neutral-800 p-6 rounded-2xl shadow-md">
            <h2 class="font-semibold text-lg mb-4">Bar Activity Chart</h2>
            <SolidApexCharts options={chartOptions} series={chartSeries} type="bar" height={250} class="rounded-2xl" />
          </div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 px-4 mt-4">
          {/* Existing charts */}
          <div class="bg-neutral-100 dark:bg-neutral-800 p-6 rounded-2xl shadow-md">
            <h2 class="font-semibold text-lg mb-4">Weekly Active Users</h2>
            <SolidApexCharts
              options={lineChartOptions}
              series={lineChartSeries}
              type="line"
              height={250}
              class="rounded-2xl"
            />
          </div>
          <div class="bg-neutral-100 dark:bg-neutral-800 p-6 rounded-2xl shadow-md">
            <h2 class="font-semibold text-lg mb-4">Quarterly Sales</h2>
            <SolidApexCharts
              options={barChartOptions}
              series={barChartSeries}
              type="bar"
              height={250}
              class="rounded-2xl"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 mt-4">
          <For each={entries()}>
            {(entry) => (
              <div class="rounded-xl border dark:border-neutral-700 p-4 mt-2 shadow-sm bg-neutral-100 dark:bg-neutral-800">
                <div class="flex justify-between items-center mb-2">
                  <h2 class="font-semibold text-xl">{entry.title}</h2>
                  <span class="text-xs text-neutral-500">{entry.timestamp}</span>
                </div>
                <p class="text-neutral-700 dark:text-neutral-300">{entry.content}</p>
              </div>
            )}
          </For>
        </div>

        {/* Apps section */}
        <div class="grid grid-cols-1 px-4 mt-4">
          <h2 class="leading-0 uppercase tracking-widest text-xl mt-6 mb-10 ">
          <b>App</b>lications
        </h2>
          <div class="flex space-x-6">
            {/* Editor */}
            <button
              class="flex flex-col items-center justify-center bg-neutral-100 dark:bg-neutral-800 p-4 rounded-2xl shadow-md w-32 hover:bg-neutral-700 hover:text-white transition"
              onClick={() => (window.location.href = '/editor')}
              aria-label="Open Editor"
            >
              <Icon icon="mdi:xml" width="50" height="50" class="text-yellow-500 shrink-0" />
              Editor
            </button>

            {/* TTS (Text To Speech) */}
            <button
              class="flex flex-col items-center justify-center bg-neutral-100 dark:bg-neutral-800 p-4 rounded-2xl shadow-md w-32 hover:bg-neutral-700 hover:text-white transition"
              onClick={() => (window.location.href = '/tts')}
              aria-label="Open Text To Speech"
            >
              <Icon icon="mdi:microphone-message" width="50" height="50" class="text-yellow-500 shrink-0" />
              TTS
            </button>

            {/* Terminal */}
            <button
              class="flex flex-col items-center justify-center bg-neutral-100 dark:bg-neutral-800 p-4 rounded-2xl shadow-md w-32 hover:bg-neutral-700 hover:text-white transition"
              onClick={() => (window.location.href = '/terminal')}
              aria-label="Open Terminal"
              
            >
              <Icon icon="mdi:console" width="50" height="50" class="text-yellow-500 shrink-0" />
              Terminal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
