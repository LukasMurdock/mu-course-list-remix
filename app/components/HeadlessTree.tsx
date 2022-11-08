import { Fragment, useCallback, useState } from 'react'

export type RenderNode = {
	isOpen: boolean
	toggleIsOpen: () => void
	hasChildren: boolean
	renderNested: JSX.Element | null
	onClick: () => void
	label: string
	hasParent: boolean
	selectedChildren: number
	parentId: string | null | undefined
	value: string
	isChecked: boolean | undefined
}

type RenderProps = {
	nodes: RenderNode[]
}

type Option = {
	parentId?: string | null
	label: string
	/** Must be unique, used as id. */
	value: string
}

export type Node = {
	value: string
	label: string
	parentId?: string | null
	isChecked: boolean
	isExpanded: boolean
}

function createDefaultNodeState(options: Option[]): Node[] {
	return options.map((option) => ({
		value: option.value,
		label: option.label,
		parentId: option.parentId,
		isChecked: false,
		isExpanded: false,
	}))
}

export function HeadlessTree({
	onChange,
	flatOptions,
	children,
}: {
	onChange: ({ nodes }: { nodes: Node[] }) => void
	flatOptions: Option[]
	children: (props: RenderProps) => JSX.Element
}) {
	const [nodeStates, setNodeStates] = useState<Node[]>(
		createDefaultNodeState(flatOptions)
	)
	const getNode = useCallback(
		(value: string) => {
			return nodeStates.find((i) => i.value === value)
		},
		[nodeStates]
	)
	const updateHandler = useCallback(
		(value: string, type: UpdateType) => {
			const newState = updateNodes(nodeStates, value, type)
			setNodeStates(newState)
			if (type === 'toggleCheckbox') {
				onChange({ nodes: newState })
			}
		},
		[nodeStates, onChange]
	)

	return renderCheckBoxList({
		nodes: nodeStates,
		updateHandler,
		getNode: getNode,
		valuesToRender: [],
		children,
	})
}

function renderCheckBoxList({
	nodes,
	getNode,
	updateHandler,
	valuesToRender,
	children,
}: {
	nodes: Node[]
	getNode: (value: string) => Node | undefined
	updateHandler: (value: string, type: UpdateType) => void
	valuesToRender: string[]
	children: (props: RenderProps) => JSX.Element
}) {
	// On first render, no values are passed.
	// So, we filter for items with no parents (top-level items).
	if (!valuesToRender.length) {
		valuesToRender = nodes.filter((i) => !i.parentId).map((i) => i.value)
	}

	function getChildNodes(parentId: string) {
		const items = nodes.filter((i) => i.parentId === parentId)
		return items.length ? items : null
	}

	function renderChildNodes(childNodes: Node[] | null) {
		if (!childNodes || !childNodes.length) return null
		return (
			<Fragment>
				{renderCheckBoxList({
					nodes,
					updateHandler,
					getNode,
					valuesToRender: childNodes.map((i) => i.value),
					children,
				})}
			</Fragment>
		)
	}

	// function getChildNodes(parentId: string) {
	// 	const items = nodes.filter((i) => i.parentId === parentId)
	// 	if (!items.length) return null
	// 	return (
	// 		<Fragment>
	// 			{renderCheckBoxList({
	// 				nodes: items,
	// 				onClick,
	// 				getNode,
	// 				valuesToRender: items.map((i) => i.value),
	// 				children,
	// 			})}
	// 		</Fragment>
	// 	)
	// }

	const nodesToRender = valuesToRender.map((value) => {
		const item = nodes.find((i) => i.value === value)!
		// if (!item) return null
		const isChecked = getNode(value)?.isChecked
		const nestedNodes = getChildNodes(value)
		const hasChildren = nestedNodes ? true : false
		const selectedChildren = nestedNodes
			? nestedNodes.filter((i) => i.isChecked).length
			: 0
		return {
			isOpen: item.isExpanded,
			// toggleIsOpen: toggleIsOpen,
			hasChildren,
			renderNested: renderChildNodes(nestedNodes),
			onClick: () => updateHandler(item.value, 'toggleCheckbox'),
			toggleIsOpen: () => updateHandler(item.value, 'toggleExpand'),
			selectedChildren,
			label: item.label,
			hasParent: item.parentId ? true : false,
			parentId: item.parentId,
			value: item.value,
			isChecked: isChecked,
		}
	})

	return children({
		nodes: nodesToRender,
	})
}

type UpdateType = 'toggleCheckbox' | 'toggleExpand'

function updateNodes(nodes: Node[], value: string, type: UpdateType): Node[] {
	// const newState = nodes.map((i) => ({ ...i }))
	if (type === 'toggleCheckbox') {
		return updateNodesWithClick(nodes, value)
	}
	return updateNodesWithExpand(nodes, value)
}

function updateNodesWithExpand(nodes: Node[], clickedValue: string): Node[] {
	const newState = nodes.map((i) => ({ ...i }))

	function getExpanded(id: string) {
		return newState.find((i) => i.value === id)!.isExpanded
	}

	function updateExpanded(id: string) {
		const isExpanded = getExpanded(id)
		newState.find((i) => i.value === id)!.isExpanded = !isExpanded
	}

	updateExpanded(clickedValue)
	return newState
}

function updateNodesWithClick(nodes: Node[], clickedValue: string): Node[] {
	const newState = nodes.map((i) => ({ ...i }))
	// getters
	function getNodeIsChecked(value: string) {
		return newState.find((i) => i.value === value)?.isChecked
	}
	// setters
	function updateParent(id: string) {
		const item = nodes.find((i) => i.value === id)
		if (!item) return
		const parent = nodes.find((i) => i.value === item.parentId)
		if (!parent) return
		const childIds = nodes
			.filter((i) => i.parentId === parent.value)
			.map((i) => i.value)
		const childStates = childIds.map((childId) => getNodeIsChecked(childId))

		// If any child is selected, select parent as well
		if (childStates.filter((s) => s).length) {
			newState.find((i) => i.value === parent.value)!.isChecked = true
		}

		// If no children are selected, unselect parent
		if (childStates.every((state) => state === false)) {
			newState.find((i) => i.value === parent.value)!.isChecked = false
		}
		// if (childStates.filter((s) => s).length) {
		//   newState.find((i) => i.value === parent.value)!.isChecked = false;
		// }
		updateParent(parent.value)
	}
	function setUnchecked(id: string) {
		newState.find((i) => i.value === id)!.isChecked = false
		nodes
			.filter((i) => i.parentId === id)
			.map((i) => i.value)
			.forEach((childId) => setUnchecked(childId))
		updateParent(id)
	}
	function setChecked(id: string) {
		newState.find((i) => i.value === id)!.isChecked = true
		// To set all children to checked
		nodes
			.filter((i) => i.parentId === id)
			.map((i) => i.value)
			.forEach((childId) => {
				setChecked(childId)
			})
		updateParent(id)
	}
	// actual logic
	const itemState = getNodeIsChecked(clickedValue)
	if (itemState) {
		setUnchecked(clickedValue)
	} else {
		setChecked(clickedValue)
	}
	return newState
}
