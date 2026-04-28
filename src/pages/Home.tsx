export function Home() {
  return (
    <div>
      <section className="pb-10 border-b border-[var(--color-border)]">
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md px-4 py-3 flex items-center gap-3 cursor-pointer hover:border-[var(--color-accent)] transition-colors"
          onClick={() => navigator.clipboard.writeText('brew install tensorwire/tap/ai')}>
          <span className="text-[var(--color-dim)]">$</span>
          <span className="text-[var(--color-green)]">brew install tensorwire/tap/ai</span>
          <span className="text-[var(--color-dim)] text-xs ml-auto">click to copy</span>
        </div>
      </section>

      <section className="py-10 border-b border-[var(--color-border)]">
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-5 mb-3">
          <div className="text-3xl font-bold text-[var(--color-accent)]">1.54x</div>
          <div className="text-[var(--color-dim)] text-sm mt-1">
            Faster than dense training at dim=4096 on 2×H100 NVLink. Same hardware, same model, same data.
          </div>
        </div>
        <p className="text-[var(--color-dim)] text-sm">
          Sparse-first training: observe which parameters are active, skip the rest. Gradients, optimizer, weight writeback — all sparse. The savings compound.
        </p>
      </section>

      <section className="py-10 border-b border-[var(--color-border)]">
        <p className="text-[var(--color-dim)] text-sm">
          2×H100 SXM NVLink, 1.2B params, 8 layers, 2000 steps. 21.7 steps/s sparse vs 14.1 dense.
        </p>
      </section>

      <section className="py-10 border-b border-[var(--color-border)]">
        <h2 className="text-base font-semibold mb-4">How</h2>
        <div className="space-y-3 text-sm">
          <div className="flex gap-3">
            <span className="text-[var(--color-accent)] shrink-0">→</span>
            <span className="text-[var(--color-dim)]"><b className="text-[var(--color-text)]">Conductor</b> tracks active rows. Inactive parameters get no gradient, no update, no writeback.</span>
          </div>
          <div className="flex gap-3">
            <span className="text-[var(--color-accent)] shrink-0">→</span>
            <span className="text-[var(--color-dim)]"><b className="text-[var(--color-text)]">Helix optimizer</b> couples weight pairs through DNA geometry. Three pairs per layer, zero orphans.</span>
          </div>
          <div className="flex gap-3">
            <span className="text-[var(--color-accent)] shrink-0">→</span>
            <span className="text-[var(--color-dim)]"><b className="text-[var(--color-text)]">Helix Dispatch</b> interleaves positions across GPUs. Both fire every GEMM simultaneously. No gradient sync.</span>
          </div>
          <div className="flex gap-3">
            <span className="text-[var(--color-accent)] shrink-0">→</span>
            <span className="text-[var(--color-dim)]"><b className="text-[var(--color-text)]">Sparse backward</b> skips frozen threadgroup tiles. 80% sparsity = 80% less backward compute.</span>
          </div>
        </div>
      </section>

      <section className="py-10 border-b border-[var(--color-border)]">
        <h2 className="text-base font-semibold mb-4">Usage</h2>
        <pre className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md p-4 text-sm leading-relaxed overflow-x-auto">
          <span className="text-[var(--color-dim)]"># Install</span>{'\n'}
          brew install tensorwire/tap/ai{'\n'}
          {'\n'}
          <span className="text-[var(--color-dim)]"># Train</span>{'\n'}
          ai train --dim 4096 --layers 8 --data corpus.txt{'\n'}
          {'\n'}
          <span className="text-[var(--color-dim)]"># Infer</span>{'\n'}
          ai chat Qwen2.5-0.5B{'\n'}
          {'\n'}
          <span className="text-[var(--color-dim)]"># Serve</span>{'\n'}
          ai serve Qwen2.5-0.5B
        </pre>
      </section>

      <section className="py-10 border-b border-[var(--color-border)]">
        <h2 className="text-base font-semibold mb-4">Backends</h2>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left text-[var(--color-dim)] pb-2 pr-3 border-b border-[var(--color-border)]">GPU</th>
              <th className="text-left text-[var(--color-dim)] pb-2 border-b border-[var(--color-border)]">How</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="py-1.5 pr-3 border-b border-[var(--color-border)]">NVIDIA</td><td className="py-1.5 border-b border-[var(--color-border)]">cuBLAS + custom CUDA kernels</td></tr>
            <tr><td className="py-1.5 pr-3 border-b border-[var(--color-border)]">Apple</td><td className="py-1.5 border-b border-[var(--color-border)]">Metal 4 compute + Metal 3 fallback</td></tr>
            <tr><td className="py-1.5 pr-3 border-b border-[var(--color-border)]">Intel</td><td className="py-1.5 border-b border-[var(--color-border)]">Xe / Level Zero</td></tr>
            <tr><td className="py-1.5 pr-3 border-b border-[var(--color-border)]">Any (Vulkan)</td><td className="py-1.5 border-b border-[var(--color-border)]">WebGPU via gogpu/wgpu</td></tr>
            <tr><td className="py-1.5 pr-3">CPU</td><td className="py-1.5">Pure Go</td></tr>
          </tbody>
        </table>
        <p className="text-[var(--color-dim)] text-xs mt-3">
          One binary. Auto-detected at build time. <code className="bg-[var(--color-surface)] px-1.5 py-0.5 rounded text-xs">CGO_ENABLED=1</code> for CUDA/Metal, <code className="bg-[var(--color-surface)] px-1.5 py-0.5 rounded text-xs">0</code> for WebGPU.
        </p>
      </section>
    </div>
  )
}
