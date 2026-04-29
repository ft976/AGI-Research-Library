export async function fetchArxivPapers(query: string, maxResults: number = 20, sectionName: string = 'Latest ArXiv Papers') {
  const targetUrl = `https://export.arxiv.org/api/query?search_query=${encodeURIComponent(query)}&start=0&max_results=${maxResults}&sortBy=submittedDate&sortOrder=desc`;
  const proxiedUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;
  
  try {
    const response = await fetch(proxiedUrl);
    if (!response.ok) {
        console.warn(`Failed to fetch from arXiv: ${response.status} ${response.statusText}`);
        return [];
    }
    
    const text = await response.text();
    
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "text/xml");
    
    const entries = xmlDoc.getElementsByTagName("entry");
    const papers = [];
    
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const idUrl = entry.getElementsByTagName("id")[0]?.textContent || '';
      // Use the last part of arxiv url as unique id
      const arxivId = idUrl.split('/').pop()?.split('v')[0] || `arxiv-${i}`;
      
      const title = entry.getElementsByTagName("title")[0]?.textContent?.replace(/\n/g, ' ').trim() || '';
      const summary = entry.getElementsByTagName("summary")[0]?.textContent?.replace(/\n/g, ' ').trim() || '';
      const published = entry.getElementsByTagName("published")[0]?.textContent || '';
      const year = published ? new Date(published).getFullYear().toString() : 'Unknown';
      
      const authorsNode = entry.getElementsByTagName("author");
      let authors = [];
      for (let j = 0; j < authorsNode.length; j++) {
        const name = authorsNode[j].getElementsByTagName("name")[0]?.textContent;
        if (name) authors.push(name);
      }
      const authorString = authors.join(', ');

      papers.push({
        id: `arxiv-${arxivId}`,
        title,
        author: authorString,
        year,
        significance: summary,
        type: 'paper' as const,
        section: sectionName,
        venue: 'ArXiv Preprints'
      });
    }
    
    return papers;
  } catch (error) {
    console.warn("Error fetching arXiv papers", error);
    return [];
  }
}

export async function fetchOpenLibraryBooks(query: string, maxResults: number = 20, sectionName: string = 'Latest Books') {
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${maxResults}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
        console.warn(`Failed to fetch from Open Library: ${response.status} ${response.statusText}`);
        return [];
    }
    
    const json = await response.json();
    const books = [];
    
    // Sort by most recently published first
    const docs = (json.docs || []).sort((a: any, b: any) => {
        const yearA = a.first_publish_year || 0;
        const yearB = b.first_publish_year || 0;
        return yearB - yearA;
    });

    for (let i = 0; i < Math.min(docs.length, maxResults); i++) {
        const doc = docs[i];
        if (!doc.title) continue;
        
        books.push({
            id: `olid-${doc.key?.replace('/works/', '') || Math.random().toString(36)}`,
            title: doc.title,
            author: doc.author_name ? doc.author_name.join(', ') : 'Unknown Author',
            year: doc.first_publish_year ? doc.first_publish_year.toString() : 'Unknown',
            significance: doc.first_sentence ? (Array.isArray(doc.first_sentence) ? doc.first_sentence[0] : doc.first_sentence) : 'A dynamic book entry discovered from Open Library.',
            type: 'book' as const,
            section: sectionName,
            venue: 'Open Library'
        });
    }
    
    return books;
  } catch (error) {
    console.warn("Failed to fetch books", error);
    return [];
  }
}

export async function fetchAllDynamicContent() {
  const [agiPapers, llmPapers, foundationPapers, books, alignmentBooks] = await Promise.all([
    fetchArxivPapers('all:"artificial general intelligence" OR all:"AGI"', 40, 'AGI Papers (ArXiv)'),
    fetchArxivPapers('all:"large language models" OR all:"LLM"', 30, 'LLMs (ArXiv)'),
    fetchArxivPapers('all:"foundation models"', 30, 'Foundation Models (ArXiv)'),
    fetchOpenLibraryBooks('artificial general intelligence', 30, 'AGI Books (Open Library)'),
    fetchOpenLibraryBooks('AI alignment', 20, 'Alignment Books (Open Library)')
  ]);
  return [...agiPapers, ...llmPapers, ...foundationPapers, ...books, ...alignmentBooks];
}
