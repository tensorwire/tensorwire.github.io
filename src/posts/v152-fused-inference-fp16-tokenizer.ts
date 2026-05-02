export const content = `
## What shipped in v1.5.2

Three things: fused inference engine, FP16 upload path, and a tokenizer rewrite. The first two are mongoose internals. The third one almost killed a 64GB machine.

### The tokenizer was O(n²)

Our BPE tokenizer worked fine on short prompts. Then someone fed it 48MB of training data and it OOM'd a 64GB DRAM machine. The merge loop was O(n²) per word — rebuild the merge priority map on every call, scan all pairs per merge iteration, allocate new string arrays per merge. On 50 million characters, that's a lot of string allocations.

The fix: auto-select strategy based on input size. Under 8KB, exact BPE merge rules run for HuggingFace token-for-token parity (chat prompts, eval, benchmarks). Over 8KB, parallel greedy longest-match on the vocab — the vocab already contains all merged tokens, so we just find the longest match at each position. Linear time, parallel across pretokenized words. 48MB tokenizes in under a second.

### FP16 raw upload

The old path for FP16 weights: read FP16 from disk → convert to FP32 in Go → pass to C → convert back to FP16 → cudaMemcpy to GPU. Two unnecessary conversions that compound rounding errors across millions of weights and double the Go heap pressure.

New path: read FP16 bytes from disk → cudaMemcpy to GPU. One call. The Go heap never sees the weight data.

### Fused inference engine

CUDAFusedInference holds all transformer weights GPU-resident with per-layer kernel dispatch. Dedicated paths for Q4 and FP16 weight formats — no flag-based conditionals, each format owns its dispatch sequence. Double-buffer streaming uploads the next layer while the GPU computes the current one, fitting 70B models in 504MB VRAM.

### Updated benchmarks (RTX 5090)

Training from scratch, 4 layers, seq_len=64, 1000 steps:

| dim | v1.5.1 | v1.5.2 | change |
|-----|--------|--------|--------|
| 128 | 773 steps/s | 569 steps/s | -26% |
| 512 | 455 steps/s | 433 steps/s | -5% |
| 1024 | 191 steps/s | 294 steps/s | **+54%** |
| 2048 | 74 steps/s | 83 steps/s | **+12%** |

The dim≤512 regression is real. The new kernel dispatch paths (Q4 dp4a, TQ3, FP16 raw upload) add ~2μs per CGo boundary crossing. At dim=128 where each training step is under 1.3ms, that overhead is measurable. At dim≥1024 where GEMMs dominate, the improved FP16 tensor core utilization more than compensates.

Fine-tuning (Qwen2.5-0.5B, 2000 steps, seq=256): 13.0 steps/s — matches v1.5.1's 13.1.

Inference (Qwen2.5-0.5B, warm serve): 234 tok/s — up from 182 (+28%).

The small-dim regression is worth investigating but it's not blocking. Real models are dim≥1024.

\`\`\`
brew upgrade tensorwire/tap/ai
\`\`\`
`
