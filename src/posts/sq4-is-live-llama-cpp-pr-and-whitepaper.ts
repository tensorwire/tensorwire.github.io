export const content = `
We published the SQ4 whitepaper and opened a PR to bring the format to llama.cpp. Here's what's happening and why.

## The paper

[Synaptic Quantization: Non-Uniform 4-bit Weight Compression via Percentile Band Calibration](https://tensorwire.ai/papers/sq4) describes SQ4 — a 4-bit quantization scheme where each block computes its own band means from the weight distribution instead of using a fixed global LUT. 256-weight blocks, 8 percentile-calibrated reconstruction values, packed nibbles \`[sign:1|band:3]\`. Same 4-bit budget as Q4_0, but the codes go where the weights actually are.

The key idea: Q4_0 uses uniform-width bins. For the Laplacian distributions typical of transformer weights, 90-99% of values end up in the first bucket. SQ4 uses equal-count percentile bands — every band gets exactly 1/8 of the weights, and the reconstruction value is the mean of its members. An outlier sideband preserves the top 0.1% at FP32.

Result: FP16-equivalent quality at Q4_0 throughput. A 32B model fits in under 7 GB.

The format requires no calibration data. One pass over the weights. Dequantization is a single register-file lookup.

Full paper: [tensorwire.ai/papers/sq4](https://tensorwire.ai/papers/sq4)

## The llama.cpp PR

We opened [ggml-org/llama.cpp#23019](https://github.com/ggml-org/llama.cpp/pull/23019) to port SQ4 into GGML. The PR adds CPU quantize + dequant, type registration, and quantize tool integration. Tensors not divisible by 256 fall back to IQ4_NL. We tested on Qwen2.5-0.5B: 2404 MiB → 416 MiB, zero validation errors.

No CUDA/Metal kernels in this initial PR — we're deferring those to follow-ups after the type is accepted. The format has been running in production with both CUDA and Metal kernels in [mongoose](https://github.com/tensorwire/mongoose) for weeks.

IQ4_NL uses the same 16 reconstruction values for every tensor in the model. SQ4 adapts per-block — heavy-tailed tensors get wider bands, tight tensors get finer resolution. No offline fitting, no calibration dataset, no second-order methods. Just sort the weights, partition, and take means.

## Sparse-First Training paper

We also published our second paper: [Sparse-First Training](https://tensorwire.ai/papers/sparse-first-training). This one covers our training framework — conductor-driven sparse backward passes that skip 80-99% of embedding rows, the needle optimizer for inline weight modification, and helix dispatch for multi-GPU training with zero gradient synchronization. 1.54x speedup on dual H100 vs PyTorch DDP at dim=4096.

Both papers are available at [tensorwire.ai](https://tensorwire.ai).

## What's next

CUDA and Metal kernels for the llama.cpp integration. More models tested on SQ4. And we're working on things we're not ready to talk about yet.

\`\`\`
brew upgrade tensorwire/tap/ai
\`\`\`
`
