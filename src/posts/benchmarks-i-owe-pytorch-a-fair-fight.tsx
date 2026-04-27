import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const data = [
  { name: 'tensorwire', stepsPerSec: 21.7 },
  { name: 'PyTorch DDP (default)', stepsPerSec: 14.1 },
]

export function BenchChart() {
  return (
    <div style={{ width: '100%', height: 300, marginTop: 24, marginBottom: 24 }}>
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ left: 40, right: 40, top: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
          <XAxis
            type="number"
            domain={[0, 25]}
            tick={{ fill: '#6a6a80', fontSize: 12, fontFamily: 'monospace' }}
            axisLine={{ stroke: '#1e1e2e' }}
            label={{ value: 'steps/s', position: 'bottom', fill: '#6a6a80', fontSize: 12, fontFamily: 'monospace' }}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: '#e0e0e8', fontSize: 12, fontFamily: 'monospace' }}
            axisLine={{ stroke: '#1e1e2e' }}
            width={180}
          />
          <Tooltip
            contentStyle={{ background: '#111118', border: '1px solid #1e1e2e', borderRadius: 6, fontFamily: 'monospace', fontSize: 12 }}
            labelStyle={{ color: '#e0e0e8' }}
            itemStyle={{ color: '#00e5e5' }}
          />
          <Bar dataKey="stepsPerSec" name="steps/s" radius={[0, 4, 4, 0]}>
            <Cell fill="#00e5e5" />
            <Cell fill="#6a6a80" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p style={{ textAlign: 'center', color: '#6a6a80', fontSize: 11, fontFamily: 'monospace', marginTop: 8 }}>
        dim=4096 · 1.2B params · 2×H100 SXM NVLink · 2000 steps
      </p>
    </div>
  )
}

export const content = `
## The asterisk on 1.54x

Last post I mentioned that sparse-first training hits 21.7 steps/s at dim=4096 on dual H100 versus PyTorch DDP's 14.1 steps/s. That's a real measurement. But there's an asterisk I need to own:

**I ran PyTorch with default settings.**

I didn't tune the DDP backend. I didn't enable torch.compile. I didn't try FSDP. I didn't tune the NCCL buffer sizes or overlap comm with compute. I used stock PyTorch DDP with AdamW because that's what the tutorials show and I don't know how to tune PyTorch — and frankly I don't want to learn.

But I owe it to anyone reading these numbers to at least try. So that's on the list: run a properly tuned PyTorch baseline and report back honestly. If tuned DDP closes the gap to 1.1x, I'll say so. If it doesn't, great.

The point was never "beat PyTorch." The point was "have a training pipeline I actually enjoy using." The speed is a bonus from the sparse-first architecture, not a goal I optimized toward.

## What's still on the bench

There's no kill like overkill. The benchmarks I still owe:

**PyTorch (tuned)** — torch.compile, FSDP, optimized NCCL. Give it every advantage. Same hardware, same model, same data. Whatever the number is, I'll publish it.

**MLX on Metal** — Apple's ML framework is optimized specifically for Apple Silicon. I'm running custom Metal compute shaders against their unified memory architecture. Need to know if they do it better. If they do, I'll learn from it.

**vLLM for distributed inference** — once the CUDA cluster path is tuned, I want to bench against vLLM's tensor parallelism for multi-GPU serving. Different problem than training throughput, but matters for the \`ai serve\` use case.

**llama.cpp at scale** — the "slightly outperforms" claim from last post is on a single GPU with a 7B model. Need to verify at 14B+ where memory pressure and KV cache management start to matter more than raw matmul throughput.

More numbers coming as I run them.
`
