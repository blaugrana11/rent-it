export default function BackButton() {
  return (
    <button
      type="button"
      onClick={() => history.back()}
      class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-gray-700 shadow hover:bg-gray-100 transition"
    >
      <svg
        class="w-5 h-5"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      Back
    </button>
  );
}
