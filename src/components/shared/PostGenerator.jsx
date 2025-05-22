import React, { useState } from "react";
import Header from "./Header";

import LoadingSpinner from "./LoadingSpinner";
import withProtectedRoute from "./ProtectedRoute";

function PostGenerator() {
  const [keyword, setKeyword] = useState("");
  const [trends, setTrends] = useState([]);
  const [selectedTrend, setSelectedTrend] = useState("");
  const [postIdeas, setPostIdeas] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFetchTrends = async () => {
    if (!keyword) {
      setError("Digite um tema (ex: moda, beleza, tecnologia).");
      return;
    }

    setError("");
    setIsLoading(true);
    setTrends([]);
    setPostIdeas("");

    try {
      const response = await fetch(`http://localhost:5000/trending?keyword=${keyword}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Erro ao buscar tendências.");

      setTrends(data.trends || []);
    } catch (err) {
      setError("Erro ao buscar tendências.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePostIdeas = async (trend) => {
    setIsLoading(true);
    setPostIdeas("");
    setSelectedTrend(trend);

    try {
      const response = await fetch(`http://localhost:5000/post_ideas?trend=${encodeURIComponent(trend)}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Erro ao gerar ideias.");

      setPostIdeas(data.post_ideas);
    } catch (err) {
      setError("Erro ao gerar ideias de post.");
      console.error(err);
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
            Ideias de Post com IA + Tendências
          </h1>
          <p className="text-gray-600 mb-6">
            Descubra o que está em alta e gere ideias de conteúdo com um clique.
          </p>

          <div className="space-y-4">
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Digite um tema (ex: moda, beleza, tecnologia)..."
              className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <button
              onClick={handleFetchTrends}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {isLoading ? <LoadingSpinner /> : "Buscar Tendências"}
            </button>

            {error && <p className="text-red-500">{error}</p>}
          </div>

          {trends.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Tópicos em alta:</h2>
              <ul className="space-y-2">
                {trends.map((trend, index) => (
                  <li key={index} className="flex justify-between items-center border p-3 rounded-lg">
                    <span>{trend.query}</span>
                    <button
                      onClick={() => handleGeneratePostIdeas(trend.query)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Gerar ideias
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {postIdeas && (
            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Ideias de post para: {selectedTrend}
              </h2>
              <pre className="text-gray-700 whitespace-pre-wrap">{postIdeas}</pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default withProtectedRoute(PostGenerator);
