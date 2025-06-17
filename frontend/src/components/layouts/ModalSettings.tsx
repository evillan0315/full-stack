// src/components/layouts/ModalSettings.tsx
import { type JSX } from 'solid-js';
export default function ModalSettings(): JSX.Element {
  return (
    <div id="settingsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden z-50">
      <div class="bg-gray-900 rounded-lg shadow-lg w-96 max-w-full p-4">
        <div class="flex justify-between items-center border-b border-gray-700 pb-2 mb-2">
          <h2 class="text-sky-500 font-bold">Settings</h2>
          <button id="closeSettings" class="text-gray-400 hover:text-red-400">
            &times;
          </button>
        </div>
        <div class="space-y-3 text-sm">
          <div>
            <label class="block text-gray-300 mb-1">Theme</label>
            <select class="w-full bg-gray-800 text-gray-300 rounded p-1">
              <option>Dark</option>
              <option>Light</option>
            </select>
          </div>
          <div>
            <label class="block text-gray-300 mb-1">Font Size</label>
            <input type="number" class="w-full bg-gray-800 text-gray-300 rounded p-1" value="14" min="10" max="32" />
          </div>
          <div>
            <label class="block text-gray-300 mb-1">Auto Save</label>
            <input type="checkbox" class="mr-1" /> Enable auto save
          </div>
        </div>
        <div class="flex justify-end mt-4">
          <button id="saveSettings" class="bg-sky-500 text-white px-3 py-1 rounded hover:bg-sky-600">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
