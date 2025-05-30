import { createSignal, createEffect, onCleanup } from 'solid-js';
import { A } from '@solidjs/router';
import Header from '../components/Header';

const testimonials = [
  {
    name: 'Alice Johnson',
    title: 'Product Manager',
    quote: 'YourAppName transformed how our team collaborates and delivered fantastic results!',
  },
  {
    name: 'Mark Lee',
    title: 'Software Engineer',
    quote: 'The ease of use and customization saved us weeks of development time.',
  },
  {
    name: 'Sandra Kim',
    title: 'CTO',
    quote: 'Reliable and secure, it’s the backbone of our daily operations.',
  },
];

const pricingPlans = [
  {
    name: 'Basic',
    price: '$9/mo',
    features: ['Up to 5 projects', 'Basic support', 'Community access'],
  },
  {
    name: 'Pro',
    price: '$29/mo',
    features: ['Unlimited projects', 'Priority support', 'Advanced analytics'],
  },
  {
    name: 'Enterprise',
    price: 'Contact us',
    features: ['Custom solutions', 'Dedicated support', 'Onboarding assistance'],
  },
];

export default function Home() {
  // Mock user login state for demo
  const [user, setUser] = createSignal<{ name: string } | null>(null);

  // Testimonial carousel state
  const [currentTestimonial, setCurrentTestimonial] = createSignal(0);

  // Auto advance testimonial every 7 seconds
  createEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((idx) => (idx + 1) % testimonials.length);
    }, 7000);
    onCleanup(() => clearInterval(interval));
  });

  // Plan selection state
  const [selectedPlan, setSelectedPlan] = createSignal(pricingPlans[0].name);

  return (
    <div class="flex h-screen flex-col bg-white dark:bg-neutral-900 dark:text-white">
      <Header />

      <main class="flex-1 overflow-auto px-6 py-12 md:px-12 lg:px-24">
        {/* Hero Section */}
        <section class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl sm:text-5xl font-extrabold leading-tight mb-4 ">
            Welcome to{' '}
            <span class="text-blue-600 dark:text-yellow-800 text-light italic text-7xl">Project</span> <span class="text-light">Board</span>
          </h1>
          <p class="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-8">
            The best solution to manage your projects efficiently and effortlessly.
          </p>

          {user() ? (
            <p class="mb-6 text-green-600 dark:text-green-400">
              Hello, {user()!.name}! Glad to have you back.
            </p>
          ) : null}

          <div class="flex justify-center gap-4">
            {user() ? (
              <A
                href="/dashboard"
                class="rounded-md bg-green-600 px-6 py-3 text-white font-semibold hover:bg-green-700 transition"
              >
                Go to Dashboard
              </A>
            ) : (
              <A
                href="/signup"
                class="rounded-md bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition"
              >
                Get Started
              </A>
            )}
            <A
              href="/learn-more"
              class="rounded-md border border-blue-600 px-6 py-3 text-blue-600 font-semibold hover:bg-blue-50 dark:hover:bg-neutral-800 transition"
            >
              Learn More
            </A>
          </div>
        </section>

        {/* Features Section */}
        <section class="mt-16 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <FeatureCard
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 12l2 2 4-4M7 12v6a2 2 0 002 2h6a2 2 0 002-2v-6"
                />
              </svg>
            }
            title="Easy to Use"
            description="Intuitive UI that helps you get started quickly without any hassle."
          />
          <FeatureCard
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 8c-1.105 0-2 .895-2 2v4a2 2 0 004 0v-4c0-1.105-.895-2-2-2z"
                />
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 12v2m0-8v2m0 4v2" />
              </svg>
            }
            title="Secure & Reliable"
            description="Your data is protected with industry-leading security measures."
          />
          <FeatureCard
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M3 6h18M3 14h18M3 18h18" />
              </svg>
            }
            title="Customizable"
            description="Tailor the platform to your specific needs with flexible options."
          />
        </section>

        {/* Testimonials Section */}
        <section class="mt-20 max-w-3xl mx-auto">
          <h2 class="text-3xl font-bold text-center mb-8">What Our Users Say</h2>
          <div class="relative bg-gray-100 dark:bg-neutral-800 rounded-lg p-8 shadow-md">
            <blockquote class="italic text-gray-800 dark:text-gray-200 mb-4">
              &ldquo;{testimonials[currentTestimonial()].quote}&rdquo;
            </blockquote>
            <p class="font-semibold text-blue-600 dark:text-blue-400">
              {testimonials[currentTestimonial()].name}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {testimonials[currentTestimonial()].title}
            </p>

            {/* Controls */}
            <div class="absolute bottom-2 right-4 flex space-x-2">
              {testimonials.map((_, i) => (
                <button
                  aria-label={`Show testimonial ${i + 1}`}
                  onClick={() => setCurrentTestimonial(i)}
                  class={`w-3 h-3 rounded-full transition-colors ${
                    currentTestimonial() === i
                      ? 'bg-blue-600 dark:bg-blue-400'
                      : 'bg-gray-400 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section class="mt-20 max-w-5xl mx-auto text-center">
          <h2 class="text-3xl font-bold mb-8">Choose Your Plan</h2>
          <div class="flex flex-col md:flex-row justify-center gap-8">
            {pricingPlans.map((plan) => (
              <div
                class={`flex-1 border rounded-lg p-6 cursor-pointer transition-shadow ${
                  selectedPlan() === plan.name
                    ? 'border-blue-600 shadow-lg dark:border-blue-400'
                    : 'border-gray-300 dark:border-neutral-700'
                }`}
                onClick={() => setSelectedPlan(plan.name)}
              >
                <h3 class="text-2xl font-semibold mb-2">{plan.name}</h3>
                <p class="text-xl mb-4">{plan.price}</p>
                <ul class="mb-6 text-gray-700 dark:text-gray-300 text-left list-disc list-inside">
                  {plan.features.map((feature) => (
                    <li>{feature}</li>
                  ))}
                </ul>
                {selectedPlan() === plan.name && (
                  <button class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition">
                    Select {plan.name}
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer class="bg-gray-100 dark:bg-neutral-900 py-6 mt-auto">
        <div class="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-gray-600 dark:text-gray-400 text-sm">
          <p>© 2025 YourAppName. All rights reserved.</p>
          <div class="flex space-x-6 mt-4 md:mt-0">
            <A href="/privacy" class="hover:text-blue-600 dark:hover:text-blue-400">
              Privacy Policy
            </A>
            <A href="/terms" class="hover:text-blue-600 dark:hover:text-blue-400">
              Terms of Service
            </A>
            <A href="/contact" class="hover:text-blue-600 dark:hover:text-blue-400">
              Contact
            </A>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard(props: { icon: any; title: string; description: string }) {
  return (
    <div class="p-6 border rounded-lg hover:shadow-lg transition cursor-default">
      <div class="mb-4 text-blue-600 dark:text-blue-400">{props.icon}</div>
      <h3 class="text-xl font-semibold mb-2">{props.title}</h3>
      <p class="text-gray-600 dark:text-gray-400">{props.description}</p>
    </div>
  );
}

