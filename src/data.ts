export type ItemType = 'book' | 'paper' | 'resource';

export interface LibraryItem {
  id: string;
  title: string;
  author: string;
  year: string;
  significance: string;
  type: ItemType;
  section: string;
  venue?: string; // only for papers
}

export const LIBRARY_DATA: LibraryItem[] = [
  // SECTION 1: Foundational & Classic Books
  { id: 'b1-1', title: 'Computing Machinery and Intelligence', author: 'Alan Turing', year: '1950', significance: 'Introduced the Turing Test; foundational paper on machine intelligence', type: 'book', section: 'Foundational & Classic Books' },
  { id: 'b1-2', title: 'The Organization of Behavior', author: 'Donald Hebb', year: '1949', significance: 'Introduced Hebbian learning; basis for neural network theory', type: 'book', section: 'Foundational & Classic Books' },
  { id: 'b1-3', title: 'Cybernetics: Control and Communication in the Animal and the Machine', author: 'Norbert Wiener', year: '1948', significance: 'Founded cybernetics; feedback systems foundational to AI', type: 'book', section: 'Foundational & Classic Books' },
  { id: 'b1-4', title: 'Perceptrons', author: 'Minsky & Papert', year: '1969', significance: 'Exposed limitations of perceptrons; shaped AI winter', type: 'book', section: 'Foundational & Classic Books' },
  { id: 'b1-5', title: 'Gödel, Escher, Bach: An Eternal Golden Braid', author: 'Douglas Hofstadter', year: '1979', significance: 'Self-reference, recursion, consciousness, and intelligence; Pulitzer Prize winner', type: 'book', section: 'Foundational & Classic Books' },
  { id: 'b1-6', title: 'The Society of Mind', author: 'Marvin Minsky', year: '1986', significance: 'Intelligence as emergent from many simple non-intelligent agents', type: 'book', section: 'Foundational & Classic Books' },
  { id: 'b1-7', title: 'Parallel Distributed Processing (2 vols)', author: 'Rumelhart & McClelland (eds.)', year: '1986', significance: 'Canonical connectionism reference; backpropagation formalized', type: 'book', section: 'Foundational & Classic Books' },
  { id: 'b1-8', title: 'The Emperor\'s New Mind', author: 'Roger Penrose', year: '1989', significance: 'Argues consciousness is non-computable; quantum microtubule theory', type: 'book', section: 'Foundational & Classic Books' },
  { id: 'b1-9', title: 'Unified Theories of Cognition', author: 'Allen Newell', year: '1990', significance: 'Proposed SOAR as unified cognitive architecture', type: 'book', section: 'Foundational & Classic Books' },
  { id: 'b1-10', title: 'Shadows of the Mind', author: 'Roger Penrose', year: '1994', significance: 'Continuation of quantum consciousness argument', type: 'book', section: 'Foundational & Classic Books' },
  { id: 'b1-11', title: 'The Conscious Mind', author: 'David Chalmers', year: '1996', significance: 'Formalized the Hard Problem of Consciousness', type: 'book', section: 'Foundational & Classic Books' },
  { id: 'b1-12', title: 'Consciousness Explained', author: 'Daniel Dennett', year: '1991', significance: 'Multiple Drafts Model of consciousness; anti-Cartesian Theatre', type: 'book', section: 'Foundational & Classic Books' },
  { id: 'b1-13', title: 'Fluid Concepts and Creative Analogies', author: 'Douglas Hofstadter', year: '1995', significance: 'Analogy as the core of cognition', type: 'book', section: 'Foundational & Classic Books' },
  { id: 'b1-14', title: 'How the Mind Works', author: 'Steven Pinker', year: '1997', significance: 'Computational theory of mind; evolutionary psychology', type: 'book', section: 'Foundational & Classic Books' },
  { id: 'b1-15', title: 'The Language Instinct', author: 'Steven Pinker', year: '1994', significance: 'Language as biological instinct; implications for NLP', type: 'book', section: 'Foundational & Classic Books' },

  // SECTION 2: AGI & Superintelligence Books
  { id: 'b2-1', title: 'The Age of Spiritual Machines', author: 'Ray Kurzweil', year: '1999', significance: 'Predicted machine intelligence exceeding humans by 2029', type: 'book', section: 'AGI & Superintelligence Books' },
  { id: 'b2-2', title: 'The Singularity Is Near', author: 'Ray Kurzweil', year: '2005', significance: 'Technological singularity; exponential intelligence growth', type: 'book', section: 'AGI & Superintelligence Books' },
  { id: 'b2-3', title: 'The Singularity Is Nearer', author: 'Ray Kurzweil', year: '2024', significance: 'Updated predictions; AGI imminent thesis revisited', type: 'book', section: 'AGI & Superintelligence Books' },
  { id: 'b2-4', title: 'Our Final Invention', author: 'James Barrat', year: '2013', significance: 'AGI as existential risk; documentary interviews with AI researchers', type: 'book', section: 'AGI & Superintelligence Books' },
  { id: 'b2-5', title: 'Superintelligence: Paths, Dangers, Strategies', author: 'Nick Bostrom', year: '2014', significance: 'Seminal AGI risk book; orthogonality thesis; paperclip maximizer', type: 'book', section: 'AGI & Superintelligence Books' },
  { id: 'b2-6', title: 'The Future of the Mind', author: 'Michio Kaku', year: '2014', significance: 'Mind uploading, consciousness, and artificial brains', type: 'book', section: 'AGI & Superintelligence Books' },
  { id: 'b2-7', title: 'Life 3.0: Being Human in the Age of Artificial Intelligence', author: 'Max Tegmark', year: '2017', significance: 'AGI scenarios; safety; long-term future of intelligence', type: 'book', section: 'AGI & Superintelligence Books' },
  { id: 'b2-8', title: 'Human Compatible: Artificial Intelligence and the Problem of Control', author: 'Stuart Russell', year: '2019', significance: 'Uncertainty-based AI alignment; new paradigm for safe AI', type: 'book', section: 'AGI & Superintelligence Books' },
  { id: 'b2-9', title: 'The Alignment Problem', author: 'Brian Christian', year: '2020', significance: 'Deep dive into value alignment in machine learning', type: 'book', section: 'AGI & Superintelligence Books' },
  { id: 'b2-10', title: 'A Thousand Brains: A New Theory of Intelligence', author: 'Jeff Hawkins', year: '2021', significance: 'Reference frames; neocortical columns; theory of intelligence', type: 'book', section: 'AGI & Superintelligence Books' },
  { id: 'b2-11', title: 'The Coming Wave', author: 'Mustafa Suleyman', year: '2023', significance: 'AI and synthetic biology convergence; containment problem', type: 'book', section: 'AGI & Superintelligence Books' },
  { id: 'b2-12', title: 'Power and Progress', author: 'Acemoglu & Johnson', year: '2023', significance: 'Historical analysis of technology and inequality; AI governance', type: 'book', section: 'AGI & Superintelligence Books' },
  { id: 'b2-13', title: 'The Worlds I See', author: 'Fei-Fei Li', year: '2023', significance: 'Memoir; ImageNet story; human-centered AI vision', type: 'book', section: 'AGI & Superintelligence Books' },
  { id: 'b2-14', title: 'Genesis: Artificial Intelligence, Hope, Anger and the Human Mind', author: 'Henry Kissinger, Eric Schmidt & Craig Mundie', year: '2024', significance: 'Geopolitical and philosophical implications of AI', type: 'book', section: 'AGI & Superintelligence Books' },
  { id: 'b2-15', title: 'Co-Intelligence: Living and Working with AI', author: 'Ethan Mollick', year: '2024', significance: 'Practical AI integration; GPT-4 capabilities and limits', type: 'book', section: 'AGI & Superintelligence Books' },
  { id: 'b2-16', title: 'The Precipice: Existential Risk and the Future of Humanity', author: 'Toby Ord', year: '2020', significance: 'AI as top existential risk; probability estimates', type: 'book', section: 'AGI & Superintelligence Books' },

  // SECTION 3: ML / Deep Learning Textbooks
  { id: 'b3-1', title: 'Pattern Recognition and Machine Learning', author: 'Christopher Bishop', year: '2006', significance: 'Gold standard Bayesian ML textbook', type: 'book', section: 'Machine Learning & Deep Learning Textbooks' },
  { id: 'b3-2', title: 'The Elements of Statistical Learning', author: 'Hastie, Tibshirani & Friedman', year: '2001/2009', significance: 'Definitive statistical ML reference', type: 'book', section: 'Machine Learning & Deep Learning Textbooks' },
  { id: 'b3-3', title: 'Deep Learning', author: 'Goodfellow, Bengio & Courville', year: '2016', significance: 'The Deep Learning Bible; covers all core architectures', type: 'book', section: 'Machine Learning & Deep Learning Textbooks' },
  { id: 'b3-4', title: 'Reinforcement Learning: An Introduction', author: 'Sutton & Barto', year: '2018 (2nd ed.)', significance: 'Definitive RL textbook; Markov decision processes', type: 'book', section: 'Machine Learning & Deep Learning Textbooks' },
  { id: 'b3-5', title: 'Artificial Intelligence: A Modern Approach', author: 'Russell & Norvig', year: '2020 (4th ed.)', significance: 'The standard AI textbook used globally', type: 'book', section: 'Machine Learning & Deep Learning Textbooks' },
  { id: 'b3-6', title: 'Mathematics for Machine Learning', author: 'Deisenroth, Faisal & Ong', year: '2020', significance: 'Linear algebra, calculus, probability for ML', type: 'book', section: 'Machine Learning & Deep Learning Textbooks' },
  { id: 'b3-7', title: 'Probabilistic Machine Learning: An Introduction', author: 'Kevin Murphy', year: '2022', significance: 'Comprehensive probabilistic ML; 2-volume set', type: 'book', section: 'Machine Learning & Deep Learning Textbooks' },
  { id: 'b3-8', title: 'Understanding Deep Learning', author: 'Simon Prince', year: '2023', significance: 'Modern deep learning with transformers; free online', type: 'book', section: 'Machine Learning & Deep Learning Textbooks' },
  { id: 'b3-9', title: 'Natural Language Processing with Transformers', author: 'Tunstall, von Werra & Wolf', year: '2022', significance: 'Hugging Face-based NLP with BERT, GPT, T5', type: 'book', section: 'Machine Learning & Deep Learning Textbooks' },
  { id: 'b3-10', title: 'Dive into Deep Learning', author: 'Zhang et al.', year: '2023', significance: 'Interactive DL book with code in PyTorch/TensorFlow', type: 'book', section: 'Machine Learning & Deep Learning Textbooks' },
  { id: 'b3-11', title: 'Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow', author: 'Aurélien Géron', year: '2022 (3rd ed.)', significance: 'Practitioner\'s guide; most popular ML engineering book', type: 'book', section: 'Machine Learning & Deep Learning Textbooks' },

  // SECTION 4: Philosophy of Mind & Consciousness Books
  { id: 'b4-1', title: 'Being No One: The Self-Model Theory of Subjectivity', author: 'Thomas Metzinger', year: '2003', significance: 'Self-model theory; phenomenal consciousness without a self', type: 'book', section: 'Philosophy & Consciousness Books' },
  { id: 'b4-2', title: 'The Feeling of What Happens', author: 'Antonio Damasio', year: '1999', significance: 'Consciousness rooted in body and emotion', type: 'book', section: 'Philosophy & Consciousness Books' },
  { id: 'b4-3', title: 'Descartes\' Error', author: 'Antonio Damasio', year: '1994', significance: 'Somatic marker hypothesis; emotion in decision-making', type: 'book', section: 'Philosophy & Consciousness Books' },
  { id: 'b4-4', title: 'Consciousness and the Brain', author: 'Stanislas Dehaene', year: '2014', significance: 'Global Workspace Theory and neural correlates of consciousness', type: 'book', section: 'Philosophy & Consciousness Books' },
  { id: 'b4-5', title: 'The Tell-Tale Brain', author: 'V.S. Ramachandran', year: '2011', significance: 'Mirror neurons, self-awareness, and consciousness', type: 'book', section: 'Philosophy & Consciousness Books' },
  { id: 'b4-6', title: 'Other Minds: The Octopus, the Sea, and the Deep Origins of Consciousness', author: 'Peter Godfrey-Smith', year: '2016', significance: 'Consciousness evolution; non-human intelligence', type: 'book', section: 'Philosophy & Consciousness Books' },
  { id: 'b4-7', title: 'Phenomenology of Spirit', author: 'G.W.F. Hegel', year: '1807', significance: 'Philosophical foundation for self-consciousness and dialectics', type: 'book', section: 'Philosophy & Consciousness Books' },
  { id: 'b4-8', title: 'Mind: A Brief Introduction', author: 'John Searle', year: '2004', significance: 'Chinese Room argument; biological naturalism', type: 'book', section: 'Philosophy & Consciousness Books' },
  { id: 'b4-9', title: 'Philosophy of Mind', author: 'Jaegwon Kim', year: '2010 (3rd ed.)', significance: 'Standard philosophy of mind textbook', type: 'book', section: 'Philosophy & Consciousness Books' },
  { id: 'b4-10', title: 'The Mystery of Consciousness', author: 'John Searle', year: '1997', significance: 'Critique of functionalism and computationalism', type: 'book', section: 'Philosophy & Consciousness Books' },

  // SECTION 5: Ethics, Governance & Society Books
  { id: 'b5-1', title: 'Weapons of Math Destruction', author: 'Cathy O\'Neil', year: '2016', significance: 'Algorithmic bias and harm in real-world AI systems', type: 'book', section: 'Ethics, Governance & Society Books' },
  { id: 'b5-2', title: 'Race After Technology', author: 'Ruha Benjamin', year: '2019', significance: 'Discriminatory design; algorithmic discrimination', type: 'book', section: 'Ethics, Governance & Society Books' },
  { id: 'b5-3', title: 'Atlas of AI', author: 'Kate Crawford', year: '2021', significance: 'Political economy of AI; environmental and labor costs', type: 'book', section: 'Ethics, Governance & Society Books' },
  { id: 'b5-4', title: 'Invisible Women', author: 'Caroline Criado Perez', year: '2019', significance: 'Data bias against women; implications for AI fairness', type: 'book', section: 'Ethics, Governance & Society Books' },
  { id: 'b5-5', title: 'The Age of Surveillance Capitalism', author: 'Shoshana Zuboff', year: '2019', significance: 'AI as instrument of behavioral prediction and control', type: 'book', section: 'Ethics, Governance & Society Books' },
  { id: 'b5-6', title: 'Smarter Than Us', author: 'Stuart Armstrong', year: '2014', significance: 'Concise AGI risk primer; control problem', type: 'book', section: 'Ethics, Governance & Society Books' },
  { id: 'b5-7', title: 'The Ethics of Artificial Intelligence', author: 'Nick Bostrom & Eliezer Yudkowsky', year: '2014', significance: 'Academic survey of AI ethics', type: 'book', section: 'Ethics, Governance & Society Books' },
  { id: 'b5-8', title: 'AI Ethics', author: 'Mark Coeckelbergh', year: '2020', significance: 'Comprehensive academic AI ethics textbook', type: 'book', section: 'Ethics, Governance & Society Books' },
  { id: 'b5-9', title: 'Artificial You', author: 'Susan Schneider', year: '2019', significance: 'Mind uploading and the ethics of digital consciousness', type: 'book', section: 'Ethics, Governance & Society Books' },
  { id: 'b5-10', title: 'The Big Nine', author: 'Amy Webb', year: '2019', significance: 'Nine tech companies shaping AI\'s future; geopolitical risk', type: 'book', section: 'Ethics, Governance & Society Books' },

  // SECTION 6: Cognitive Science & Neuroscience Books
  { id: 'b6-1', title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', year: '2011', significance: 'System 1 vs System 2 thinking; baseline for AGI cognition modeling', type: 'book', section: 'Cognitive Science & Neuroscience Books' },
  { id: 'b6-2', title: 'The Language of Thought', author: 'Jerry Fodor', year: '1975', significance: 'Mentalese; symbolic cognition architecture', type: 'book', section: 'Cognitive Science & Neuroscience Books' },
  { id: 'b6-3', title: 'Metaphors We Live By', author: 'Lakoff & Johnson', year: '1980', significance: 'Conceptual metaphor theory; grounded cognition', type: 'book', section: 'Cognitive Science & Neuroscience Books' },
  { id: 'b6-4', title: 'Where Mathematics Comes From', author: 'Lakoff & Núñez', year: '2000', significance: 'Embodied mathematics; embodied cognition implications for AI', type: 'book', section: 'Cognitive Science & Neuroscience Books' },
  { id: 'b6-5', title: 'The Embodied Mind', author: 'Varela, Thompson & Rosch', year: '1991', significance: 'Enactivism; cognition as embodied action', type: 'book', section: 'Cognitive Science & Neuroscience Books' },
  { id: 'b6-6', title: 'How Brains Think', author: 'William Calvin', year: '1996', significance: 'Evolutionary origins of intelligence; Darwinian algorithms', type: 'book', section: 'Cognitive Science & Neuroscience Books' },
  { id: 'b6-7', title: 'The Brain from Inside Out', author: 'György Buzsáki', year: '2019', significance: 'Neural oscillations; inside-out brain paradigm', type: 'book', section: 'Cognitive Science & Neuroscience Books' },
  { id: 'b6-8', title: 'Incognito: The Secret Lives of the Brain', author: 'David Eagleman', year: '2011', significance: 'Unconscious processing; implications for AI consciousness', type: 'book', section: 'Cognitive Science & Neuroscience Books' },
];
