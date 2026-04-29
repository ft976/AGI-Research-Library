import { LibraryItem } from './data';

export const PAPERS4_DATA: LibraryItem[] = [
  {
    id: 'p12-1',
    title: 'FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness',
    author: 'Tri Dao et al.',
    year: '2022',
    significance: 'Hardware-aware algorithm that eliminated the memory bottleneck of Transformers, enabling the massive context windows required for foundational AGI capabilities.',
    type: 'paper',
    section: 'Core Architectures',
    venue: 'NeurIPS'
  },
  {
    id: 'p12-2',
    title: 'LoRA: Low-Rank Adaptation of Large Language Models',
    author: 'Edward Hu et al. (Microsoft)',
    year: '2021',
    significance: 'Revolutionized parameter-efficient fine-tuning (PEFT) by freezing pre-trained weights and injecting trainable rank decomposition matrices. Democratized model alignment.',
    type: 'paper',
    section: 'Alignment & Interpretability',
    venue: 'ICLR 2022'
  },
  {
    id: 'p12-3',
    title: 'Mamba: Linear-Time Sequence Modeling with Selective State Spaces',
    author: 'Albert Gu, Tri Dao',
    year: '2023',
    significance: 'Challenged the dominant Transformer paradigm with a highly efficient selective state-space architecture, achieving infinite context processing at linear time complexity.',
    type: 'paper',
    section: 'Core Architectures',
    venue: 'arXiv'
  },
  {
    id: 'p12-4',
    title: 'Kahneman-Tversky Optimization (KTO): Alignment for Large Language Models',
    author: 'Ethayarajh et al.',
    year: '2024',
    significance: 'Provides human alignment without requiring paired preference data, leveraging human utility theory (Prospect Theory) to maximize alignment efficiency.',
    type: 'paper',
    section: 'Alignment & Interpretability',
    venue: 'ICML 2024'
  },
  {
    id: 'p12-5',
    title: 'Generative Agents: Interactive Simulacra of Human Behavior',
    author: 'Park et al. (Stanford/Google)',
    year: '2023',
    significance: 'Demonstrated that LLM-backed agents with memory, reflection, and planning architectures can simulate complex, believable human societies in a sandbox environment.',
    type: 'paper',
    section: 'Agents & Embodiment',
    venue: 'UIST'
  },
  {
    id: 'p12-6',
    title: 'Reflexion: Language Agents with Verbal Reinforcement Learning',
    author: 'Shinn et al.',
    year: '2023',
    significance: 'Equipped language agents with the ability to reflect on past failures and maintain a reflective trajectory, drastically improving capabilities on complex decision-making tasks.',
    type: 'paper',
    section: 'Agents & Embodiment',
    venue: 'NeurIPS'
  },
  {
    id: 'p12-7',
    title: 'DeepSeek-V3 Technical Report',
    author: 'DeepSeek AI',
    year: '2024',
    significance: 'Outlined a highly efficient training methodology for a massive Mixture-of-Experts (MoE) architecture, achieving frontier AGI-level reasoning with significantly reduced compute costs.',
    type: 'paper',
    section: 'Recent Milestones',
    venue: 'arXiv'
  }
];
