import { Plan } from '@/types/Plans'
import { AddPlan } from '../AddPlan'
import { UpdatePlan } from '../UpdatePlan'
import { DeletePlan } from '../DeletePlan'

interface Props {
  isLoading: boolean
  plans: Plan[] | undefined
}
export function PlanTable({ isLoading, plans }: Props) {
  return (
    <div className="grid grid-cols-3 gap-10 px-10 py-5 mobile:grid-cols-1">
      <AddPlan />
      {isLoading ? (
        <div></div>
      ) : (
        plans?.map((plan, index) => {
          return (
            <div key={index}>
              {/* Aplica a classe "fire-effect" quando plan.hot é true */}
              <div
                className={`flex flex-col gap-3 rounded-xl bg-zinc-800 px-2 py-6`}
              >
                <div className="flex justify-between px-5 text-center text-3xl text-lime">
                  <UpdatePlan plan={plan} />
                  {plan.plan_name}
                  <DeletePlan plan={plan} />
                </div>
                <div className="my-5 grid grid-cols-2 gap-5">
                  <div className="flex flex-col items-center gap-3 text-xl mobile:gap-1 laptop:text-lg">
                    <div>Duração</div>
                    <div className="text-lime">{plan.days} dias</div>
                  </div>
                  <div className="flex flex-col items-center gap-3 text-xl mobile:gap-1 laptop:text-lg">
                    <div>Código</div>
                    <div className="text-lime">{plan.plan_code}</div>
                  </div>
                  <div className="flex flex-col items-center gap-3 text-xl mobile:gap-1 laptop:text-lg">
                    <div>Produto</div>
                    <div className="text-lime">{plan.product.product_name}</div>
                  </div>
                  <div className="flex flex-col items-center gap-3 text-xl mobile:gap-1 laptop:text-lg">
                    <div>Plano hot</div>
                    <div className="text-lime">
                      {plan.product.product_hot ? 'sim' : 'não'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
