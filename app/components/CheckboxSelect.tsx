import { HeadlessTree, RenderNode } from './HeadlessTree'
import type { Node } from './HeadlessTree'
import { classNames } from '~/utils/classnames'
import { useEffect, useRef, useState } from 'react'
// import autoAnimate from '@formkit/auto-animate'

export type CheckboxNode = Node

export type CheckboxSelectOptions = {
	label: string
	value: string
	parentId?: string | null
}[]

type CheckboxSelectProps = {
	/** E.g., 'Select filter' */
	label: string
	options: CheckboxSelectOptions
	handleChange: ({ nodes }: { nodes: CheckboxNode[] }) => void
}

export function CheckboxSelect({
	label,
	options,
	handleChange,
}: CheckboxSelectProps) {
	return (
		<HeadlessTree onChange={handleChange} flatOptions={options}>
			{({ nodes }) => {
				return (
					<div aria-label={label}>
						{nodes.map((node) => {
							return (
								<div key={node.value} className="w-full">
									{/* <h2 className="relative flex w-full items-center pb-2">
                    {node.isOpen ? (
                      <ChevronDownIcon className="h-6 w-6" />
                    ) : (
                      <ChevronUpIcon className="h-6 w-6" />
                    )}

                    <div className="ml-1.5">
                      <button
                        type="button"
                        aria-expanded={true}
                        onClick={node.toggleIsOpen}
                        className="after:absolute after:top-0 after:right-0 after:bottom-0 after:left-0 after:z-20 hover:underline"
                      >
                        {node.label}
                      </button>
                      {node.selectedChildren ? (
                        <div className="text-sm">
                          {node.selectedChildren} selected
                        </div>
                      ) : null}
                    </div>
                  </h2> */}
									<div
										role="group"
										// aria-labelledby={`facet-group-${titleSlug}`}
										className="relative flex overflow-x-hidden overflow-y-scroll px-3"
										// className="relative max-h-64 overflow-x-hidden overflow-y-scroll px-3"
									>
										<fieldset>
											<legend className="sr-only">
												{node.label}
											</legend>

											<Facet node={node} />
										</fieldset>
									</div>
								</div>
							)
						})}
					</div>
				)
			}}
		</HeadlessTree>
	)
}

function Facet({ node }: { node: RenderNode }) {
	// const parent = useRef(null)

	// useEffect(() => {
	// 	parent.current && autoAnimate(parent.current)
	// }, [parent])

	return (
		<ul
		// ref={parent}
		>
			<li
				className={classNames(
					'relative flex pl-8',
					// handle input focus - label accessibility
					'[&_input:focus_+_label::before]:border-4 [&_input:focus_+_label::before]:shadow-[0_0_0_3px_#3b82f6] [&_input:focus_+_label::before]:outline-2 [&_input:focus_+_label::before]:outline-offset-4',
					// handle input hover - label accessibility
					'hover:[&_input:not(:disabled)_+_label::before]:shadow-[0_0_0_10px_#b1b4b6]'
				)}
			>
				<input
					type="checkbox"
					id={node.value}
					name={node.value}
					value={node.value}
					checked={node.isChecked}
					className="sr-only -top-0.5 -left-2 z-10 h-11 w-11"
					onChange={() => node.onClick()}
				/>
				<label
					htmlFor={node.value}
					className={classNames(
						node.isChecked
							? 'after:absolute after:top-4 after:left-[6px] after:h-[6.5px] after:w-3 after:-rotate-45 after:border-b-[3px] after:border-l-[3px] after:border-solid after:border-current after:opacity-100'
							: '',
						"-mt-1 inline-block cursor-pointer py-3 pl-1 pr-4 before:absolute before:top-2 before:left-0 before:box-border before:h-6 before:w-6 before:border-2 before:border-current before:content-['']"
					)}
				>
					{node.label}
				</label>
			</li>

			{node.isChecked ? node.renderNested : null}
			{/* {node.isChecked ? node.renderNested : null} */}
			{/* <Animation show={node.isChecked}>{node.renderNested}</Animation> */}
		</ul>
	)
}
