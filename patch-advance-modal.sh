#!/bin/bash
sed -i '' -e 's/<DialogContent className="sm:max-w-4xl overflow-y-auto max-h-\[90vh\] p-6">/<DialogContent className="sm:max-w-4xl p-0 bg-white border-0 shadow-2xl overflow-hidden rounded-xl">/' /Volumes/"Office Files"/"1. Projects"/criptonhris/src/routes/payroll-advance.tsx

sed -i '' -e 's/<DialogHeader className="mb-4">/<DialogHeader className="px-6 py-5 border-b border-slate-100 flex flex-row items-center justify-between">\'$'\n                    <div className="flex items-center gap-3">\'$'\n                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">\'$'\n                        <Banknote className="size-5" \/>\'$'\n                      <\/div>\'$'\n                      <div>/' /Volumes/"Office Files"/"1. Projects"/criptonhris/src/routes/payroll-advance.tsx

sed -i '' -e 's/<DialogTitle className="text-xl">/<DialogTitle className="text-lg font-bold text-slate-800">/' /Volumes/"Office Files"/"1. Projects"/criptonhris/src/routes/payroll-advance.tsx

sed -i '' -e 's/<DialogDescription>/<DialogDescription className="text-xs text-slate-500 mt-1">/' /Volumes/"Office Files"/"1. Projects"/criptonhris/src/routes/payroll-advance.tsx

sed -i '' -e 's/<\/DialogDescription>/<\/DialogDescription>\'$'\n                      <\/div>\'$'\n                    <\/div>/' /Volumes/"Office Files"/"1. Projects"/criptonhris/src/routes/payroll-advance.tsx

sed -i '' -e 's/<div className="py-2">/<div className="px-6 py-5 max-h-[75vh] overflow-y-auto bg-slate-50\/50">/' /Volumes/"Office Files"/"1. Projects"/criptonhris/src/routes/payroll-advance.tsx
