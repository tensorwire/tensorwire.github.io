export interface PostMeta {
  slug: string
  title: string
  date: string
  summary: string
  hasChart?: boolean
}

export const posts: PostMeta[] = [
  {
    slug: 'v152-fused-inference-fp16-tokenizer',
    title: 'v1.5.2: Fused Inference, FP16, and a Tokenizer That OOM\'d a 64GB Machine',
    date: '2026-05-01',
    summary: 'Inference +28%. Training +54% at dim≥1024. The tokenizer was O(n²) and nobody noticed until we fed it 48MB.',
  },
  {
    slug: 'benchmarks-i-owe-pytorch-a-fair-fight',
    title: 'Benchmarks: I Owe PyTorch a Fair Fight',
    date: '2026-04-27',
    summary: 'The 1.54x number has an asterisk. I ran PyTorch with default settings. Here\'s what I still owe.',
    hasChart: true,
  },
  {
    slug: 'why-i-wrote-a-gpu-training-engine-in-go',
    title: 'Why I Wrote a GPU Training Engine in Go',
    date: '2026-04-20',
    summary: 'I got tired of Python\'s toolchain for fine-tuning. So I wrote my own — and accidentally built something faster.',
  },
]
