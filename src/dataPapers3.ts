import { LibraryItem } from './data';

export const PAPERS3_DATA: LibraryItem[] = [
  {
    id: 'paper-q-star-speculation',
    title: 'Speculations on Q-Learning and Large Language Models',
    author: 'Various AI Researchers',
    year: '2023',
    significance: 'Informal discussions and speculations around the integration of search, rl, and language modeling leading to perceived superintelligence capabilities.',
    type: 'paper',
    section: 'Recent Milestones',
    venue: 'Community Discussions'
  },
  {
    id: 'paper-swe-agent',
    title: 'SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering',
    author: 'John Yang et al.',
    year: '2024',
    significance: 'Demonstrates an AI agent that can solve real-world GitHub issues by interacting with a computer interface, a step towards AGI in software engineering.',
    type: 'paper',
    section: 'Recent Milestones',
    venue: 'ArXiv'
  },
  {
    id: 'paper-llama3',
    title: 'The Llama 3 Herd of Models',
    author: 'Meta AI',
    year: '2024',
    significance: 'Open weights models reaching parity with top proprietary models, showcasing the rapid democratization of near-AGI capabilities.',
    type: 'paper',
    section: 'Recent Milestones',
    venue: 'ArXiv'
  },
  {
    id: 'paper-voyager',
    title: 'Voyager: An Open-Ended Embodied Agent with Large Language Models',
    author: 'Guanzhi Wang et al.',
    year: '2023',
    significance: 'Introduced an LLM-powered embodied lifelong learning agent in Minecraft that continuously explores the world, acquires diverse skills, and makes novel discoveries without human intervention.',
    type: 'paper',
    section: 'Agents & Embodiment',
    venue: 'ArXiv'
  },
  {
    id: 'paper-gato',
    title: 'A Generalist Agent (Gato)',
    author: 'Scott Reed et al. (DeepMind)',
    year: '2022',
    significance: 'A single multi-modal neural network that can play Atari, caption images, chat, and stack blocks with a real robot arm, pushing the paradigm of generalist models.',
    type: 'paper',
    section: 'Agents & Embodiment',
    venue: 'ArXiv'
  },
  {
    id: 'paper-rt2',
    title: 'RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control',
    author: 'Google DeepMind',
    year: '2023',
    significance: 'Shows that vision-language models can be fine-tuned to directly output robotic actions, bridging the gap between web-scale reasoning and physical embodiment.',
    type: 'paper',
    section: 'Agents & Embodiment',
    venue: 'ArXiv'
  },
  {
    id: 'paper-self-instruct',
    title: 'Self-Instruct: Aligning Language Models with Self-Generated Instructions',
    author: 'Yizhong Wang et al.',
    year: '2022',
    significance: 'A framework for improving the instruction-following capabilities of pretrained language models by bootstrapping off their own generations.',
    type: 'paper',
    section: 'Alignment & Interpretability',
    venue: 'ArXiv'
  },
  {
    id: 'paper-dpo',
    title: 'Direct Preference Optimization: Your Language Model is Secretly a Reward Model',
    author: 'Rafael Rafailov et al.',
    year: '2023',
    significance: 'A stable, performant, and computationally lightweight alternative to RLHF that directly optimizes the policy using preference data.',
    type: 'paper',
    section: 'Alignment & Interpretability',
    venue: 'NeurIPS'
  },
  {
    id: 'paper-constitutional-ai',
    title: 'Constitutional AI: Harmlessness from AI Feedback',
    author: 'Yuntao Bai et al. (Anthropic)',
    year: '2022',
    significance: 'Introduced a mechanism to train non-evasive and harmless AI assistants using AI feedback rather than human labels, based on a set of principles or "constitution".',
    type: 'paper',
    section: 'Alignment & Interpretability',
    venue: 'ArXiv'
  },
  {
    id: 'paper-mechanistic-interp',
    title: 'Towards Monosemanticity: Extracting Interpretable Features from Claude 3 Sonnet',
    author: 'Aditi Tesilean et al. (Anthropic)',
    year: '2024',
    significance: 'Scaled up sparse autoencoders to extract millions of interpretable features from a production-scale LLM, shedding light on the internal representations of advanced models.',
    type: 'paper',
    section: 'Alignment & Interpretability',
    venue: 'Anthropic Research'
  }
];
