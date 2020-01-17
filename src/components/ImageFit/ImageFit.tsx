import * as React from 'react';
import s from './ImageFitSkin.scss';
import { ImageFitter } from './ImageFitter';

interface ImageFitSkinProps {
  image: string;
  onSave(position: any): void;
  initialPosition?: { x?: number; y?: number };
}

interface State {
  dragging: boolean;
}

export class ImageFit extends React.Component<ImageFitSkinProps, State> {
  static displayName: string = 'ImageFit';
  state: State = {
    dragging: false,
  };
  private readonly imageRef: React.RefObject<
    HTMLDivElement
  > = React.createRef();
  private positionY: number = 50;
  private readonly imageFitter: ImageFitter = new ImageFitter();

  constructor(props: Readonly<ImageFitSkinProps>) {
    super(props);
    this.setInitialPosition();
  }

  componentDidMount(): void {
    if (this.imageRef.current) {
      this.imageFitter.setupDragging(this.imageRef.current);
    }
  }

  private setInitialPosition() {
    const { initialPosition } = this.props;
    if (initialPosition && initialPosition.y !== null) {
      const y = Number(initialPosition.y);
      this.positionY = y >= 0 ? y : 50;
    }
  }

  componentWillUnmount(): void {
    this.imageFitter.unsetDragging();
  }

  render() {
    const { image } = this.props;
    const style = {
      backgroundImage: `url(${image})`,
      backgroundPositionY: `${this.positionY}%`,
    };
    const { dragging } = this.state;
    const className = `${s.root}${dragging ? ` ${s.dragging}` : ''}`;
    return (
      <div className={className}>
        {dragging ? (
          <div className={s.saveControls}>
            <button className={s.controlBtn__secondary} onClick={this.onCancel}>
              Cancel
            </button>
            <button className={s.controlBtn__primary} onClick={this.onSave}>
              Save
            </button>
          </div>
        ) : (
          <div className={s.editControls}>
            <button className={s.controlBtn} onClick={this.onStartDragging}>
              Edit
            </button>
          </div>
        )}
        <div className={s.imageFit} style={style} ref={this.imageRef} />
      </div>
    );
  }

  private readonly onStartDragging = () =>
    this.setState({ dragging: true }, this.onDragChange);

  private readonly onStopDragging = () =>
    this.setState({ dragging: false }, this.onDragChange);

  private readonly onSave = () => {
    this.setPosition();
    this.onStopDragging();
    this.props.onSave(this.positionY);
  };

  private readonly onCancel = () => {
    this.setBackground();
    this.onStopDragging();
  };

  private setPosition() {
    if (this.imageRef.current) {
      this.positionY = parseFloat(
        this.imageRef.current.style.backgroundPositionY || '',
      );
    }
  }

  private setBackground() {
    if (this.imageRef.current) {
      this.imageRef.current.style.backgroundPositionY = `${this.positionY}%`;
    }
  }

  private readonly onDragChange = () => {
    this.imageFitter.setDragging(this.state.dragging);
  };
}
