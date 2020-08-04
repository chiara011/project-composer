import { IStackTokens, Stack, TextField } from "@fluentui/react"
import { useDispatch, useSelector } from "react-redux"
import { ComposerState } from "types"
import { setUsername, setFilename, setEditorOptions } from "store/actions"
import NumberField from "components/utilities/NumberField"
import React from "react"

const stackTokens: IStackTokens = {
  childrenGap: 10,
}

export default function SystemConfig() {
  
  const dispatch = useDispatch()
  const system = useSelector((state: ComposerState) => state.system)
  
  const _handleUsernameChange = (value?: string) => {
    if (value)
      dispatch(setUsername(value))
  }

  const _handleFilenameChange = (value?: string) => {
    if (value)
      dispatch(setFilename(value))
  }

  const _handleTempoChange = (value: number) => {
    dispatch(setEditorOptions({
      ...system.editorOptions,
      resolution: value
    }))
  }

  const _handleLengthChange = (value: number) => {
    let newWidth = Math.floor(value / system.editorOptions.resolution) * system.editorOptions.frameSize
    dispatch(setEditorOptions({
      ...system.editorOptions,
      width: newWidth
    }))

  }

  const _handleFrameSizeChange = (value: number) => {
    // Width = Width(frameSize)
    // By dividing width (px) by the size in px of a frame, you get the total number of frames
    // times the new size in px of a single frame you get the new width.
    let newWidth = Math.floor(system.editorOptions.width / system.editorOptions.frameSize) * value
    dispatch(setEditorOptions({
      ...system.editorOptions,
      frameSize: value,
      width: newWidth
    }))
  }

  return <div>
    <Stack tokens={stackTokens}>
      <TextField
        label="File name"
        defaultValue={system.filename}
        onChange={(ev, value) => _handleFilenameChange(value)}
      />
      <TextField
        label="Author"
        defaultValue={system.username}
        onChange={(ev, value) => _handleUsernameChange(value)}
      />
      <NumberField
        defaultValue={system.editorOptions.resolution}
        minValue={1}
        maxValue={10000}
        label={"Resolution (ms)"}
        onChange={_handleTempoChange}
      />
      <NumberField
        defaultValue={system.editorOptions.width/system.editorOptions.frameSize*system.editorOptions.resolution}
        minValue={1}
        maxValue={50000}
        label={"Length (ms)"}
        onChange={_handleLengthChange}
      />
      <NumberField
        defaultValue={system.editorOptions.frameSize}
        minValue={1}
        maxValue={200}
        label={"Frame size (px)"}
        onChange={_handleFrameSizeChange}
      />
      
    </Stack>
  </div>
}