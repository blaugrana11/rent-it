import { A } from "@solidjs/router";
import Layout from "~/components/Layout";

export default function AboutPage() {
  return (
    <Layout>
    <div class="max-w-3xl mx-auto px-4 py-12 text-gray-800">
      <h1 class="text-4xl font-bold mb-6 text-indigo-700">About Rent-It</h1>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-2">What is Rent-It?</h2>
        <p>
          Rent-It is a fictional peer-to-peer rental platform. It allows users to
          publish listings and rent everyday items easily from tools to sports
          gear. Though not deployed in production, it simulates a complete rental
          experience.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-2">Why this project?</h2>
        <p>
          This project was developed as part of my personal learning journey in web
          development. It helped me deepen my skills in:
        </p>
        <ul class="list-disc list-inside mt-2 space-y-1">
          <li>Secure authentication and session handling</li>
          <li>Image upload and file handling</li>
          <li>Modern UI with SolidJS and Tailwind</li>
          <li>MongoDB for backend data storage</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-2">Tech Stack</h2>
        <ul class="list-disc list-inside mt-2 space-y-1">
          <li>Framework: SolidStart</li>
          <li>Database: MongoDB</li>
          <li>Authentication: Session-based (cookies)</li>
          <li>Styling: Tailwind CSS</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-2">About the Developer</h2>
        <p>
          My name is Nabil. I'm passionate about building useful and thoughtful
          web applications. Rent-It reflects both my technical abilities and my
          interest in creating user-centered digital experiences.
        </p>
        <p class="mt-2">
          Feel free to connect with me:
        </p>
        <ul class="list-inside mt-2 space-y-1">
          <li>
            <A class="text-indigo-600 hover:underline" href="https://github.com/blaugrana11" target="_blank">
              GitHub
            </A>
          </li>
          <li>
            <A class="text-indigo-600 hover:underline" href="https://www.linkedin.com/in/nabil-hajchaib-901133301/" target="_blank">
              LinkedIn
            </A>
          </li>
        </ul>
      </section>
    </div>
    </Layout>
  );
}

