import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import LoadingSpinner from "./LoadingSpinner";
import withProtectedRoute from "./ProtectedRoute";

function PostGenerator() {
  const [prompt, setPrompt] = useState("");
  const [generatedPost, setGeneratedPost] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGeneratePost = async () => {
    if (!prompt) {
      setError("Prompt is required.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          message: prompt,
          model: "azure-openai", // Placeholder for Azure OpenAI integration
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate post.");
      }

      const data = await response.json();
      setGeneratedPost(data.response || "No response received.");
    } catch (err) {
      console.error("Error generating post:", err);
      setError("An error occurred while generating the post.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Generate a Post
          </h1>
          <p className="text-gray-600 mb-6">
            Use AI to generate engaging posts for your content needs.
          </p>

          <div className="space-y-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter a prompt for the post..."
              className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={5}
            ></textarea>

            {error && <p className="text-red-500">{error}</p>}

            <button
              onClick={handleGeneratePost}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {isLoading ? <LoadingSpinner /> : "Generate Post"}
            </button>
          </div>

          {generatedPost && (
            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Generated Post
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap">{generatedPost}</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default withProtectedRoute(PostGenerator);
