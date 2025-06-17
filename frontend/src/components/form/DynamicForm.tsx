// src/components/DynamicForm.tsx

 import { Component, createSignal, For, onMount, JSX } from 'solid-js';
 import { createStore, produce } from 'solid-js/store';

 interface SchemaProperty {
     type: string;
     title: string;
     description?: string;
     format?: string;
     enum?: string[];
     [key: string]: any; // Allow for additional schema properties
 }

 interface JsonSchema {
     type: 'object';
     properties: {
         [key: string]: SchemaProperty;
     };
     required?: string[];
     [key: string]: any; // Allow for additional schema properties
 }

 interface FormData {
     [key: string]: any;
 }

 interface DynamicFormProps {
     schema: JsonSchema | string; // Accept schema as JSON object or URL
     onSubmit: (data: FormData) => void;
 }


 const DynamicForm: Component<DynamicFormProps> = (props) => {
     const [schema, setSchema] = createSignal<JsonSchema | null>(null);
     const [formData, setFormData] = createStore<FormData>({});
     const [loading, setLoading] = createSignal(true);
     const [error, setError] = createSignal<string | null>(null);


     onMount(async () => {
         try {
             setLoading(true);
             let resolvedSchema: JsonSchema;

             if (typeof props.schema === 'string') {
                 // Assume it's a URL
                 const response = await fetch(props.schema);
                 if (!response.ok) {
                     throw new Error(`HTTP error! status: ${response.status}`);
                 }
                 resolvedSchema = await response.json() as JsonSchema;
             } else {
                 resolvedSchema = props.schema;
             }

             setSchema(resolvedSchema);

             // Initialize form data with default values, ensuring type safety
             const initialData: FormData = {};
             if (resolvedSchema.properties) {
                 Object.entries(resolvedSchema.properties).forEach(([key, property]) => {
                     if (property.default !== undefined) {
                         initialData[key] = property.default;
                     } else if (property.type === 'boolean') {
                         initialData[key] = false; // Default boolean to false
                     } else {
                         initialData[key] = ''; // Default other types to empty string
                     }
                 });
             }
             setFormData(initialData);


         } catch (e: any) {
             setError(e.message || 'Failed to load schema.');
         } finally {
             setLoading(false);
         }
     });



     const handleChange = (key: string, value: any) => {
         setFormData(
             produce((state) => {
                 state[key] = value;
             })
         );
     };

     const handleSubmit = (e: Event) => {
         e.preventDefault();
         props.onSubmit(formData);
     };

     const renderFormField = (key: string, property: SchemaProperty): JSX.Element => {
         const isRequired = schema()?.required?.includes(key) || false;

         switch (property.type) {
             case 'string':
                 if (property.enum) {
                     return (
                         <div class="mb-4">
                             <label for={key} class="block text-sm font-medium text-gray-950 dark:text-gray-100">{property.title} {isRequired ? <span class="text-red-500">*</span> : null}</label>
                             <select
                                 id={key}
                                 class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm dark:bg-gray-950 dark:border-gray-700 dark:text-gray-100"
                                 value={formData[key] || ''}
                                 onChange={(e) => handleChange(key, e.target.value)}
                                 required={isRequired}
                             >
                                 <For each={property.enum}>
                                     {(option) => (
                                         <option value={option}>{option}</option>
                                     )}
                                 </For>
                             </select>
                             {property.description && <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{property.description}</p>}
                         </div>
                     );
                 }

                 if (property.format === 'textarea') {
                     return (
                         <div class="mb-4">
                             <label for={key} class="block text-sm font-medium text-gray-950 dark:text-gray-100">{property.title} {isRequired ? <span class="text-red-500">*</span> : null}</label>
                             <textarea
                                 id={key}
                                 class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm dark:bg-gray-950 dark:border-gray-700 dark:text-gray-100"
                                 value={formData[key] || ''}
                                 onChange={(e) => handleChange(key, e.target.value)}
                                 required={isRequired}
                                 rows={4}
                             />
                              {property.description && <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{property.description}</p>}
                         </div>
                     );
                 }
                 return (
                     <div class="mb-4">
                         <label for={key} class="block text-sm font-medium text-gray-950 dark:text-gray-100">{property.title} {isRequired ? <span class="text-red-500">*</span> : null}</label>
                         <input
                             type="text"
                             id={key}
                             class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm dark:bg-gray-950 dark:border-gray-700 dark:text-gray-100"
                             value={formData[key] || ''}
                             onChange={(e) => handleChange(key, e.target.value)}
                             required={isRequired}
                         />
                          {property.description && <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{property.description}</p>}
                     </div>
                 );
             case 'number':
                 return (
                     <div class="mb-4">
                         <label for={key} class="block text-sm font-medium text-gray-950 dark:text-gray-100">{property.title} {isRequired ? <span class="text-red-500">*</span> : null}</label>
                         <input
                             type="number"
                             id={key}
                             class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm dark:bg-gray-950 dark:border-gray-700 dark:text-gray-100"
                             value={formData[key] || ''}
                             onChange={(e) => handleChange(key, parseFloat(e.target.value))}
                             required={isRequired}
                         />
                          {property.description && <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{property.description}</p>}
                     </div>
                 );
             case 'boolean':
                 return (
                     <div class="mb-4">
                         <label for={key} class="inline-flex items-center">
                             <input
                                 type="checkbox"
                                 id={key}
                                 class="rounded border-gray-300 text-sky-600 shadow-sm focus:border-sky-500 focus:ring-sky-500 dark:bg-gray-950 dark:border-gray-700 dark:text-sky-600 dark:focus:ring-sky-500"
                                 checked={formData[key] || false}
                                 onChange={(e) => handleChange(key, e.target.checked)}
                                 required={isRequired}
                             />
                             <span class="ml-2 text-sm text-gray-950 dark:text-gray-100">{property.title} {isRequired ? <span class="text-red-500">*</span> : null}</span>
                         </label>
                         {property.description && <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{property.description}</p>}
                     </div>
                 );
             default:
                 return (
                     <div class="mb-4">
                         <label for={key} class="block text-sm font-medium text-gray-950 dark:text-gray-100">{property.title} {isRequired ? <span class="text-red-500">*</span> : null}</label>
                         <input
                             type="text"
                             id={key}
                             class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm dark:bg-gray-950 dark:border-gray-700 dark:text-gray-100"
                             value={formData[key] || ''}
                             onChange={(e) => handleChange(key, e.target.value)}
                             required={isRequired}
                         />
                         {property.description && <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{property.description}</p>}
                     </div>
                 );
         }
     };


     return (
         <div class="container mx-auto p-4 dark:bg-gray-950 dark:text-gray-100">
             {loading() && <div class="text-center">Loading...</div>}
             {error() && <div class="text-red-500">Error: {error()}</div>}
             {schema() && (
                 <form onSubmit={handleSubmit} class="max-w-lg mx-auto">
                     <For each={Object.entries(schema()!.properties)}>
                         {([key, property]) => renderFormField(key, property)}
                     </For>
                     <div class="mt-6">
                         <button type="submit" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:bg-sky-950 dark:hover:bg-sky-900">
                             Submit
                         </button>
                     </div>
                 </form>
             )}
         </div>
     );
 };

 export default DynamicForm;

 /*
 ## Example Usage and Implementation Guide

 ### 1.  Import the Component
 ```typescript
 import DynamicForm from './components/DynamicForm';
 ```

 ### 2. Define a Submit Handler

 Create a function to handle the form submission:

 ```typescript
 const handleSubmit = (data: any) => {
     console.log('Form Data:', data);
     // Perform actions with the form data, like sending it to an API
 };
 ```

 ### 3. Create the JSON Schema

 Define the JSON schema for your form.  This can be a static object or the URL of an API endpoint that returns the schema.  Here’s an example schema:

 ```typescript
 const schema = {
     type: 'object',
     properties: {
         firstName: {
             type: 'string',
             title: 'First Name',
             description: 'Enter your first name',
         },
         lastName: {
             type: 'string',
             title: 'Last Name',
             description: 'Enter your last name',
         },
         email: {
             type: 'string',
             title: 'Email',
             format: 'email',
             description: 'Enter your email address',
         },
         age: {
             type: 'number',
             title: 'Age',
             description: 'Enter your age',
         },
         newsletter: {
             type: 'boolean',
             title: 'Subscribe to Newsletter',
             default: true,
             description: 'Check if you want to subscribe to our newsletter',
         },
         role: {
             type: 'string',
             title: 'Role',
             enum: ['admin', 'editor', 'viewer'],
             description: 'Select your role',
         },
         bio: {
             type: 'string',
             title: 'Bio',
             format: 'textarea',
             description: 'Tell us about yourself',
         },
     },
     required: ['firstName', 'lastName', 'email'],
 };
 ```

 ### 4.  Implement the Component in your App

 Use the `DynamicForm` component within your SolidJS application:

 ```typescript
 import { render } from 'solid-js/web';
 import DynamicForm from './components/DynamicForm';

 function App() {
     const handleSubmit = (data: any) => {
         console.log('Form Data:', data);
         // Handle form submission
     };

     const schema = {
         type: 'object',
         properties: {
             firstName: {
                 type: 'string',
                 title: 'First Name',
                 description: 'Enter your first name',
             },
             lastName: {
                 type: 'string',
                 title: 'Last Name',
                 description: 'Enter your last name',
             },
             email: {
                 type: 'string',
                 title: 'Email',
                 format: 'email',
                 description: 'Enter your email address',
             },
             age: {
                 type: 'number',
                 title: 'Age',
                 description: 'Enter your age',
             },
             newsletter: {
                 type: 'boolean',
                 title: 'Subscribe to Newsletter',
                 default: true,
                 description: 'Check if you want to subscribe to our newsletter',
             },
              role: {
                 type: 'string',
                 title: 'Role',
                 enum: ['admin', 'editor', 'viewer'],
                 description: 'Select your role',
             },
              bio: {
                 type: 'string',
                 title: 'Bio',
                 format: 'textarea',
                 description: 'Tell us about yourself',
             },
         },
         required: ['firstName', 'lastName', 'email'],
     };


     return (
         <div>
             <h1>Dynamic Form Example</h1>
             <DynamicForm schema={schema} onSubmit={handleSubmit} />
         </div>
     );
 }

 render(() => <App />, document.getElementById('root') as HTMLElement);
 ```

 ### 5.  Using a Schema from an API

 To fetch the schema from an API, provide the URL to the `schema` prop:

 ```typescript
 <DynamicForm schema="https://your-api.com/schema" onSubmit={handleSubmit} />
 ```

 The component will automatically fetch and render the form based on the schema from the API.

 ### Explanation:

 *   **Dynamic Rendering:** The component dynamically renders form fields based on the `schema` prop.
 *   **Type Handling:**  It supports `string`, `number`, and `boolean` types, rendering appropriate input fields.
 *   **Validation:** It respects the `required` fields in the schema, adding a visual indicator.
 *   **Enum Support:**  If a property has an `enum`, it renders a select dropdown.
 *   **FormData State:**  It uses a SolidJS store (`formData`) to manage the form's state.
 *   **Error Handling:** Displays loading and error messages.
 *   **Tailwind CSS:**  Uses Tailwind CSS for styling.
 */


