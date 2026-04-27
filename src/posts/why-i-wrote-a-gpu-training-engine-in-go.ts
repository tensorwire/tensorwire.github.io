export const content = `
I wanted to fine-tune a model. That's it. That was the whole goal.

But if you've tried fine-tuning outside of a managed platform, you know the stack: Python 3.11 (not 3.12, that breaks torch), CUDA 12.1 (not 12.4, that breaks flash-attn), a 200MB requirements.txt, conda environments that corrupt themselves, and a \`transformers\` library that changes its API every minor release. I spent more time debugging import errors than training models.

I write Go for a living. I wanted one binary that trains, infers, and serves. No virtual environments. No dependency hell. No "works on my machine." Just \`go build\` and run.

So I wrote one.

## What it turned into

What started as a weekend hack to wrap cuBLAS in Go turned into a full training system:

- **mongoose** — a GPU compute engine with backends for Metal, CUDA, Xe, WebGPU, and CPU. One \`Engine\` interface, auto-detected at build time.
- **ai** — a CLI that does everything: \`ai train\`, \`ai chat\`, \`ai serve\`, \`ai quantize\`. One binary.
- **gguf** — model I/O for GGUF, SafeTensors, and NumPy. Reads anything HuggingFace or llama.cpp produces.
- **tokenizer** — BPE in pure Go. Loads HuggingFace and SentencePiece formats.

The constraint was simple: if I can't \`go build\` it from a clean checkout, it doesn't ship.

## The accidental optimizer

The interesting accident happened when I was debugging why my loss wasn't converging. I'd been staring at gradient histograms and noticed something obvious in retrospect: at any given training step, the vast majority of parameters aren't doing anything useful. Their gradients are near-zero. Their optimizer states are just decaying toward nothing.

I started tracking which parameters were actually "hot" — receiving meaningful gradient signal — and only updating those. Then I noticed that certain weight pairs (gate and up projections, Q and K matrices) had correlated activity patterns. When one was hot, the other usually was too.

I started coupling them. Not in a learned-routing MoE sense, but geometrically — using the structure of DNA base pairing as a template for how paired parameters should exchange gradient information. A↔T bonds (2 hydrogen bonds, weaker coupling) for Q↔K pairs. G↔C bonds (3 hydrogen bonds, stronger coupling) for gate↔up pairs.

This became **Helix** — an optimizer that:
1. Observes which parameters are active (the "Conductor")
2. Couples paired parameters through DNA rung geometry
3. Skips frozen parameters entirely — no gradient, no momentum update, no memory allocation
4. Checkpoints at loss floors and reverts when loss rebounds (an "immune system")

## Inference

For inference, the fused compute shader pipeline (one command buffer per token on Metal, one stream per token on CUDA) slightly outperforms llama.cpp on equivalent quantization levels. Not by a huge margin — llama.cpp is extremely well optimized — but enough that I don't need to shell out to it.

The Metal path uses custom compute kernels for RMSNorm, RoPE, GQA attention, and SiLU, with Metal 4 \`matmul2d\` TensorOps for weight multiplications. The CUDA path uses cuBLAS plus custom fused kernels. Both auto-quantize to INT8 (models under 4B params) or INT4 (over 4B) on load.

## What this is

This is a solo project. One person, building in the open. No company, no team, no funding round. I'm a developer who wanted better tools for fine-tuning and ended up building a training engine.

The code is at [github.com/tensorwire](https://github.com/tensorwire). It's source-available — free for personal, research, and educational use. If you're a company building commercial infrastructure on it, reach out for a license.

I'll be writing here about what I'm building, what I'm learning, and the occasional deep-dive into GPU kernels. If you're interested in ML infrastructure, sparse training, or just building things from scratch in Go, follow along.
`
