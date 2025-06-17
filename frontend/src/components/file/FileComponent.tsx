/*interface FileComponentState { }

const FileComponent: Component<FileComponentProps> = (props) => {
  const [state, setState] = createStore<FileNodeState>({});

  // memoized computations
  const currentIcon = createMemo();
  const hasChildren = createMemo();

  // handlers: toggle, handleClick, handleRename, handleInputKeyDown

  // lifecycle: onMount(() => setState('newName', props.file.name));

  return (
    <div class="relative">
      <div class={classes.container} ... >
        <Icon ... icon={currentIcon()} />
        {renderFileName()}
        {props.file.isDirectory && <Icon  onClick={()=>void} />}
      </div>
      {renderChildren()}
    </div>
  );
};

export default FileComponent;*/
