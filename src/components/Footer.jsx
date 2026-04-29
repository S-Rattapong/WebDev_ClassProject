export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-3 lg:px-6">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-300">ผู้จัดทำ</h3>
          <p className="mt-4 text-lg font-medium text-white">FIBO-MART</p>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            <p>66340500015 Napatchon Thongkham </p>
            <p>66340500021 Teetawat Kamonthakapai</p>
            <p>66340500047 Rattapong Saiboonrod</p>
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-300">การชำระเงิน</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            <li>โอนผ่านธนาคาร</li>
            <li>บัตรเครดิต / เดบิต</li>
            <li>ใบเสนอราคา / เครดิตเทอม</li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-300">Support</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            <li>Help Center 24/7</li>
            <li>support@fibo-mart.example</li>
            <li>02-000-0000</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
